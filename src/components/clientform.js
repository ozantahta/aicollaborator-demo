import React, { useContext, useRef, useCallback } from "react";
import {Form,Button} from "react-bootstrap";
import db,{firebase} from "../firebase";
import {AuthContext} from "../context/Auth"
import {Redirect, withRouter,useLocation, useHistory} from "react-router-dom"

function ClientForm() {
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
    const history = useHistory()
    
    async function tempLogin (){
        var actionCodeSettings = {
            url: window.location.origin + location.pathname,
            handleCodeInApp:true
        };
        try {
            await firebase.auth()
                .sendSignInLinkToEmail(emailRef.current.value,actionCodeSettings)
            window.localStorage.setItem("emailForSignIn",emailRef.current.value);
            history.push("/activate");
        } catch(error){
            alert(error)
        }
    }

    const AddClient = () => {
        
        const divs = document.querySelectorAll("div.mb-3")
        const item = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[]}
        for (var a=0; a < divs.length;a++){
            for (var i=0;i<divs[a].childElementCount;i++){
                if (divs[a].children[i].firstElementChild.checked === true){
                    item[a].push(divs[a].children[i].innerText)
                }
            }
        }

        const checkList = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[]}
        const checkbox = document.querySelectorAll(".checkbox-box")
        for (var i=0; i<checkbox.length;i++){   
            for (var a=0; a < checkbox[i].getElementsByTagName("input").length;a++){      
                if (checkbox[i].getElementsByTagName("input")[a].checked === true){
                    checkList[i].push(checkbox[i].getElementsByTagName("span")[a].innerHTML)
                }
            }
        }

        console.log(checkList)

        const obj = {}
        const form = document.querySelectorAll("input.form-control")
        for (var i=0; i<form.length;i++){
            obj[i] = form[i].value
        }

        
        
        db.collection("client").add({
            client_name:obj[0],
            client_address:obj[1],
            client_phone_number:obj[2],
            client_website:obj[3],
            client_linkedin:obj[4],
            client_twitter:obj[5],
            client_contact_name:obj[6],
            client_contact_title:obj[7],
            client_contact_email:obj[8],
            data_created:firebase.firestore.FieldValue.serverTimestamp(),
            data_updated:null,
            date_founded:"There is no title in form",
            clientglobal:{
                certified:"There is no title in form",
                client_focus:"There is no title in form",
                industry_focus:checkList[8],
                minimum_project_size:"There is no title in form"
            },
            clientusecase:{
                ai_tools:checkList[5],
                cloud_infrastructure:checkList[6],
                ethical_and_legal_issues:checkList[0],
                measure_of_success:obj[12],
                objective:obj[11],
                service_technology:checkList[3],
                strategic_goal:obj[10],
                use_case_description:obj[15],
                use_case_epic:obj[14]
            }
        })

        db.collection("client").get().then((querySnap=>{
            querySnap.forEach((doc)=>{
              
              if (doc.data().clientglobal != null){
                  const clientglobalData = doc.data().clientglobal;
                  db.collection("client/" + doc.id + "/clientglobal").add({
                      certified:clientglobalData.certified,
                      client_focus:clientglobalData.client_focus,
                      industry_focus:clientglobalData.industry_focus,
                      minimum_project_size:clientglobalData.minimum_project_size
                  })
      
                  db.collection("client").doc(doc.id).update({
                      clientglobal:firebase.firestore.FieldValue.delete()
                  })
      
                  db.collection("client").doc(doc.id).update({
                      data_created:firebase.firestore.FieldValue.serverTimestamp()
                  })
      
              }if(doc.data().clientusecase != null){
                  const usecaseData = doc.data().clientusecase;
                  db.collection("client/" + doc.id + "/clientusecase").add({
                      ai_tools:usecaseData.ai_tools,
                      cloud_infrastructure:usecaseData.cloud_infrastructure,
                      ethical_and_legal_issues:usecaseData.ethical_and_legal_issues,
                      measure_of_success:usecaseData.measure_of_success,
                      objective:usecaseData.objective,
                      service_technology:usecaseData.service_technology,
                      strategic_goal:usecaseData.strategic_goal,
                      use_case_description:usecaseData.use_case_description,
                      use_case_epic:usecaseData.use_case_epic
                  })
      
                  db.collection("client").doc(doc.id).update({
                      clientusecase: firebase.firestore.FieldValue.delete()
                  })
              }
            })
        }))
        tempLogin()
    
    }   

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/myaccount"/>
    }
    
    return(
        <div>
            <h1 style={{textAlign:"center"}}>Client Form</h1>
            <Form>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Name?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Address?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Phone Number?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Website?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Linkedin?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Twitter?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Contact Name?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Contact Title?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Contact Email?</Form.Label>
                    <Form.Control type="email" ref={emailRef}></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>List Other Global Locations (City, Country)?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the Strategic Goal of AI Adoption?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the Objective of this AI Project?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the KPIs and Targets for Success Measurement?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the Key Stakeholders Roles?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <div className="checkbox-container">
                    <label>Select any Business, Ethical and Compliance Priorities?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Explainability</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Bias</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Privacy</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>GDPR</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>AI Policy</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>AI Literacy</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>AI Traininig</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Workforce Management</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                        </div>
                    </div>
                </div>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>What is the Use Case Epic or Solution Name?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the AI Use Case or Solution desired?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <div className="checkbox-container">
                    <label>Select the Project Type?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Pilot</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Operationalizatio</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Privacy</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Center of Excellence Service Provider</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Staff Augmentation</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                        </div>
                    </div>
                </div>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe any Startup Network Partner Restrictions or Disqualifying Criteria?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <div className="checkbox-container">
                    <label>What is the Client Data Readiness Anticipated?</label>
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
                    <label>What are your AI Service Technologies?</label>
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
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Virtual Agents / Chatbots</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/>
                            <span>IoT / AI Optimized Hardware</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Natural Language Processing (NLP)</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Speech Recognition</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Computer Vision / Image Recognition</span></label>
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
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Robotic Process Automation (RPA)</span></label>
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
                            <input className="checkbox-input" type="checkbox"/><span>Java</span></label>
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
                    <label>Please select supported AI Tools and Frameworks?</label>
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
                            <input className="checkbox-input" type="checkbox"/><span>Google Cloud Platform (GCP)</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Microsoft Azure</span></label>
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
                    <Form.Label style={{ marginBottom: "10px" }}>Describe Client desired Service Delivery Timeframe (ex. Pilot parameters)?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <div className="checkbox-container">
                    <label>Please select Industry Focus?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Retail</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Consumer Packaged Goods</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Healthcare</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/><span>Manufacturing</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Information Technology</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Professional and Business Services</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input className="checkbox-input" type="checkbox"/>
                            <span>Finance and Insurance</span></label>
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
                            <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                        </div>
                    </div>
                </div>
                <div style={{textAlign:"center"}}>
                    <Button variant="second" style={{width:"58%",marginBottom:"20px",backgroundColor:"blue",color:"white"}} onClick={AddClient}>Add Client Data</Button>{' '}
                </div>
                </Form>
        </div>
        
    )
}

export default withRouter(ClientForm)