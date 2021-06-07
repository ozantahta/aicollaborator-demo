/* eslint-disable no-redeclare */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Button, FormLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React,{useContext, useCallback, useRef, useState} from "react";
import db,{firebase} from "../firebase";
import {withRouter,Redirect,useLocation} from "react-router-dom";
import {AuthContext} from "../context/Auth";

function PartnerForm({history}){
    const formStyle = {
        alignItems: "center",
        margin: "40px 300px 10px"
        // marginBottom:"70px",
        // borderStyle:"solid",
        // borderWidth:"1px",
        // borderColor:"blue",
        // padding:"50px 400px 50px 50px"
    }


    
    let location = useLocation()
    const emailRef = useRef()
    const [emailItem, setEmailItem] = useState("")

    const handleLogin = useCallback(
        async event => {
            var actionCodeSettings = {
                url: window.location.origin + location.pathname,
                handleCodeInApp:true
            };
            event.preventDefault();
            console.log(emailRef.current.value, " type: " ,typeof(emailRef.current.value))
            try {
                await firebase.auth()
                    .sendSignInLinkToEmail(emailRef.current.value,actionCodeSettings)
                window.localStorage.setItem("emailForSignIn",emailRef.current.value);
                history.push("/activate");
            } catch(error){
                alert(error)
            }
        },
        [history]
    )

    const AddPartner = () => {

        // const divs = document.querySelectorAll("div.mb-3")
        // const item = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[]}
        // for (var a=0; a < divs.length;a++){
        //     for (var i=0;i < divs[a].childElementCount;i++){
        //     if (divs[a].children[i].firstElementChild.checked === true){
        //         item[a].push(divs[a].children[i].innerText)
        // }}}

        const obj = {}
        const form = document.querySelectorAll("input.form-control")
        for (var i=0; i < form.length; i++){
                    obj[i] = form[i].value
        }

        const checkList = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[]}
        const checkbox = document.querySelectorAll(".checkbox-box")
        for (var i=0; i<checkbox.length;i++){   
            for (var a=0; a < checkbox[i].getElementsByTagName("input").length;a++){      
                if (checkbox[i].getElementsByTagName("input")[a].checked === true){
                    checkList[i].push(checkbox[i].getElementsByTagName("span")[a].innerHTML)
                }
            }
        }

        const radioList = {0:[],1:[],2:[]}
        const radio = document.querySelectorAll(".radio-container")
        for (var i=0;i<radio.length;i++){
            for (var a=0; a<radio[i].getElementsByTagName("input").length;a++){
                if (radio[i].getElementsByTagName("input")[a].checked === true){
                    radioList[i].push(radio[i].getElementsByTagName("input")[a].value)
                }
            }
        }
        
        db.collection("partner").add({
            category:obj[1],
            data_created:firebase.firestore.FieldValue.serverTimestamp(),
            data_updated: null,
            date_founded:obj[10],
            partner_address:obj[3],
            partner_contact_name:obj[7],
            partner_contact_title:obj[8],
            partner_contact_email:obj[9],
            partner_linkedin:obj[5],
            partner_name:obj[0],
            partner_phone_number:obj[2],
            partner_size:radioList[0][0],
            partner_twitter:obj[6],
            partner_website:obj[4],
            venture_funding:radioList[1][0],
            partnerglobal:{
                average_project_size:radioList[2][0],
                certified:null,
                client_focus:checkList[6],
                data_readiness:checkList[0],
                global_locations:obj[11],
                industry_focus:checkList[7],
                leader_matrix:null,
                master_services_agreement:"boolen",
                nondisclosure_agreement:"boolen",
                pricing_model:null,
                rating:"number",
                reseller_agreement:"boolen",
                resources_available: ["empty array"],
                reviews_description: null,
                service_technology:checkList[1],
                testimonials_description:null
            },
            partnerusecase:{
                use_case_epic:obj[12],
                service_use_case_description:obj[13]
            },
            
        }).then(()=> {
            console.log("Succesfully Written!")
        })

        
        db.collection("partner").get().then(querySnap=>{
          querySnap.forEach(doc=>{
             
                if (doc.data().partnerglobal != null){
                  const partnerData = doc.data().partnerglobal;
                  db.collection("partner/" + doc.id + "/partnerglobal").add({
                      average_project_size:partnerData.average_project_size,
                      certified:partnerData.certified,
                      client_focus:partnerData.client_focus,
                      data_readiness:partnerData.data_readiness,
                      global_locations:partnerData.global_locations,
                      industry_focus:partnerData.industry_focus,
                      leader_matrix:partnerData.leader_matrix,
                      master_services_agreement:partnerData.master_services_agreement,
                      nondisclosure_agreement:partnerData.nondisclosure_agreement,
                      pricing_model:partnerData.pricing_model,
                      rating:partnerData.rating,
                      reseller_agreement:partnerData.reseller_agreement,
                      resources_available:partnerData.resources_available,
                      reviews_description:partnerData.reviews_description,
                      service_technology:partnerData.service_technology,
                      testimonials_description:partnerData.testimonials_description
                  })
                  
                  db.collection("partner").doc(doc.id).update({
                      partnerglobal: firebase.firestore.FieldValue.delete()
                  })
    
                  db.collection("partner").doc(doc.id).update({
                      data_created:firebase.firestore.FieldValue.serverTimestamp()
                  })
      
              }if (doc.data().partnerusecase != null){
                  //usecase başka fonksiyona ayır
                  const usecaseData = doc.data().partnerusecase;
      
                  db.collection("partner/" + doc.id + "/partnerusecase").add({
                      service_use_case_description:usecaseData.service_use_case_description,
                      use_case_epic:usecaseData.use_case_epic
                  })
      
                  db.collection("partner").doc(doc.id).update({
                      partnerusecase:firebase.firestore.FieldValue.delete()
                  })
              }
          })
      })
    }
    
    const {currentUser} = useContext(AuthContext)

    if (currentUser){
        return <Redirect to="/myaccount"/>
    }

    return(
        <div>
            <Form onSubmit={handleLogin}>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Partner Name?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Partner Category?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Partner Phone Number?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Partner Address?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Partner Website?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Partner Linkedin?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Partner Twitter?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Contact Name?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Contact Title?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Contact Email?</Form.Label>
                <Form.Control type="email" ref={emailRef} value={emailItem} onChange={Event => setEmailItem(Event.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Date Founded?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <fieldset id="groupone" className="radio-container">
                <label>Company Size Range?</label>
                <div>
                    <label className="radio-label"><input type="radio" value="Freelancer" name="groupone"/>
                    <span>Freelancer</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="2 - 9" name="groupone"/>
                    <span>2 - 9</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="10 - 49" name="groupone"/>
                    <span>10 - 49</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="50 - 249" name="groupone"/>
                    <span>50 - 249</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="250 - 999" name="groupone"/>
                    <span>250 - 999</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="1000+" name="groupone"/>
                    <span>1000+</span></label>
                </div>
            </fieldset>
            <fieldset id="grouptwo" className="radio-container">
                <label>Venture Funding?</label>
                <div>
                    <label className="radio-label"><input type="radio" value="Seed" name="grouptwo"/>
                    <span>Seed</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="Series A" name="grouptwo"/>
                    <span>Series A</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="Series B" name="grouptwo"/>
                    <span>Series B</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="Series C +" name="grouptwo"/>
                    <span>Series C +</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="Public" name="grouptwo"/>
                    <span>Public</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="Option 6" name="grouptwo"/>
                    <span>Option 6</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="Other" name="grouptwo"/>
                    <span>Other</span></label>
                </div>
            </fieldset>
            <Form.Group style={formStyle}>
                <FormLabel style={{ marginBottom: "10px" }}>List Other Global Locations (City, Country)?</FormLabel>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <div className="checkbox-container">
                <label>What is the Client Data Readiness Required?</label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Identified</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Prepared</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Enriched and transformed</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Operationalized</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>N/A</span></label>
                    </div>
                </div>
            </div>
            <div className="checkbox-container">
                <label>What are your AI Service Technologies? </label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Machine Learning</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Deep Learning</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Decision Management</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Content Creation</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Virtual Agents / Chatbots</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>IoT / AI Optimized Hardware</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Natural Language Processing (NLP)</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Speech Recognition</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Computer Vision / Image Recognition</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Emotion Recognition</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Biometrics</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Robotic Process Automation (RPA)</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Marketing Automation</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Big Data</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Option 15</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                    </div>
                </div>
            </div>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>What is your Use Case or Solution Name?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <Form.Group style={formStyle}>
                <FormLabel style={{ marginBottom: "10px" }}>Describe your Use Case or Solution for a Client?</FormLabel>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <div className="checkbox-container">
                <label>Please select supported Development Technologies or Frameworks? </label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>ReactJS</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>AngularJS</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>NodeJS</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>PHP</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Python</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>R</span></label>
                    </div>
                </div>
            </div>
            <div className="checkbox-container">
                <label>Please select supported AI Tools and Frameworks? </label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Scikit Learn</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>TensorFlow</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Theano</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Caffe</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>MxNet</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Keras</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>PyTorch</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>CNTK</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Auto ML</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>OpenNN</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/>
                        <span>H20: Open Source AI Platform</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Google ML Kit</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                    </div>
                </div>
            </div>
            <div className="checkbox-container">
                <label>Please select supported Cloud Infrastructure?</label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/>
                        <span>Amazon Web Services (AWS)</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/>
                        <span>Google Cloud Platform (GCP)</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/>
                        <span>Microsoft Azure</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Private</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>N/A</span></label>
                    </div>
                </div>
            </div>
            <div className="checkbox-container">
                <label>Please select supported Development Process?</label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>SAFe</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Scrum</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Agile</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>DevOps</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>AI/ML Lifecycle</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>MLOps</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Waterfall</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                    </div>
                </div>
            </div>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Please describe Service Delivery Timeframe (AverageDuration)?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <div className="checkbox-container">
                <label>Please select Client Focus?</label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Small business</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Midsize</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Enterprise</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Reseller</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                    </div>
                </div>
            </div>
            <div className="checkbox-container">
                <label>Please select Industry Focus?</label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Retail</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Consumer Packaged Goods</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Healthcare</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Information Technology</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Professional and Business Services</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Finance and Insurance</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Real Estate</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Government</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label">
                        <input className="checkbox-input" type="checkbox"/><span>Manufacturing</span></label>
                    </div>
                </div>
            </div>
            <fieldset id="groupthree" className="radio-container">
                <label>Please describe Average Project Size?</label>
                <div>
                    <label className="radio-label"><input type="radio" value="1000+" name="groupthree"/>
                    <span>1000+</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="5000+" name="groupthree"/>
                    <span>5000+</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="10000+" name="groupthree"/>
                    <span>10000+</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="25000+" name="groupthree"/>
                    <span>25000+</span></label>
                </div>
                <div>
                    <label className="radio-label"><input type="radio" value="50000+" name="groupthree"/>
                    <span>50000+</span></label>
                </div>
            </fieldset>
            <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Please describe any Accolades, Awards and/orCertifications?</Form.Label>
                <Form.Control type="text" required></Form.Control>
            </Form.Group>
            <div style={{textAlign:"center"}}>
                <Button type="submit" variant="second" style={{width:"58%",marginBottom:"20px",backgroundColor:"blue",color:"white"}} disabled={!emailItem} onClick={AddPartner}>Add Partner Data</Button>{' '}
            </div>
            </Form>
        </div>
        
    )
}

export default withRouter(PartnerForm)