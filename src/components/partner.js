/* eslint-disable no-mixed-operators */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/anchor-is-valid */
import "../css/style.css";
import React,{useState, useEffect, useCallback, useRef, useContext} from "react";
import db,{firebase,app} from "../firebase";
import { Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row,Col,Alert} from "react-bootstrap";
import { AuthContext } from "../context/Auth";
import { useForm } from "react-hook-form";
import "../css/partnerstyle.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Link, withRouter, useLocation, Redirect} from "react-router-dom";

function Partner({history}){
    const [partnerData,partnerList] = useState([])
    const [partnerglobalData,setPartnerglobal] = useState([])
    const [parnterUsecase, setUsecase] = useState([])

    const customStyle = {
        color: "#0E4277",
        fontSize:"40px",
        textAlign:"center",
        marginTop:"20px"
    }

    const partnerStyle = {
        color:"black",
        textAlign:"left",
        padding:"10px 10px 10px ",
        margin:"30px 70px 30px",
        borderStyle:"groove"
    }

    
    const { register, handleSubmit, formState:{errors} } = useForm()

    const onSubmit = (data) => {

        handleLogin()

        const checkList = {0:[],1:[],2:[],3:[],4:[]}
        const checkbox = document.querySelectorAll(".checkbox-box")
        for (var i=0; i<checkbox.length;i++){   
            for (var a=0; a < checkbox[i].getElementsByTagName("input").length;a++){      
                if (checkbox[i].getElementsByTagName("input")[a].checked === true){
                    checkList[i].push(checkbox[i].getElementsByTagName("span")[a].innerHTML)
                }
            }
        }

        db.collection("partner").add({
            category:data.category,
            data_created:firebase.firestore.FieldValue.serverTimestamp(),
            imageURL:fileUrl,
            data_updated: null,
            date_founded:fullDate,
            partner_address:data.addressLine + " " + data.addressCity + " " + data.addressSP + " " +data.addressZip,
            partner_contact_name:data.contactName,
            partner_contact_title:data.contactTitle,
            partner_contact_email:data.contactEmail,
            partner_linkedin:data.linkedin,
            partner_name:data.partnerName,
            partner_phone_number:data.phoneNumber,
            partner_size:data.sizeRange,
            partner_twitter:data.twitter,
            partner_website:data.website,
            venture_funding:data.ventureFunding,
            partnerglobal:{
                average_project_size:data.projectSize,
                // certified:null,
                client_focus:checkList[2].length === 1 ? checkList[2][0] : checkList[2],
                data_readiness:checkList[0].length === 1 ? checkList[0][0] : checkList[0],
                global_locations:data.location,
                industry_focus:checkList[3].length === 1 ? checkList[3][0] : checkList[3],
                // leader_matrix:null,
                // master_services_agreement:"boolen",
                // nondisclosure_agreement:"boolen",
                pricing_model:data.pricingModel,
                // reseller_agreement:"boolen",
                resources_available: checkList[4].length === 1 ? checkList[4][0] : checkList[4],
                reviews_description: data.reviewsDesc,
                service_technology:checkList[1].length === 1 ? checkList[1][0] : checkList[1]
                // testimonials_description:null
            },
            partnerusecase:{
                use_case_epic:data.usecaseEpic,
                service_use_case_description:data.usecaseDesc
            },
            
        }).then(()=> {
            console.log("Succesfully Written!")
        }).catch((error)=> {
            alert(error)
        })

        db.collection("partner").get().then(querySnap=>{
          querySnap.forEach(doc=>{
             
              if (doc.data().partnerglobal != null){
                  const partnerData = doc.data().partnerglobal;
                  db.collection("partner/" + doc.id + "/partnerglobal").add({
                      average_project_size:partnerData.average_project_size,
                    //   certified:partnerData.certified,
                      client_focus:partnerData.client_focus,
                      data_readiness:partnerData.data_readiness,
                      global_locations:partnerData.global_locations,
                      industry_focus:partnerData.industry_focus,
                    //   leader_matrix:partnerData.leader_matrix,
                    //   master_services_agreement:partnerData.master_services_agreement,
                    //   nondisclosure_agreement:partnerData.nondisclosure_agreement,
                      pricing_model:partnerData.pricing_model,
                    //   rating:partnerData.rating,
                    //   reseller_agreement:partnerData.reseller_agreement,
                      resources_available:partnerData.resources_available,
                      reviews_description:partnerData.reviews_description,
                      service_technology:partnerData.service_technology
                    //   testimonials_description:partnerData.testimonials_description
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


    // const handleUpload = () => {
    //   db.collection("partner").add({
    //     imageURL:fileUrl
    //   }).then(()=> {
    //     console.log("Company Logo is written succesfully: ",fileUrl)
    //   })
    // }

    const [fileUrl, setFileUrl] = useState("")

    const onFileChange = async (e) => {
      const file = e.target.files[0]
      const storageRef = app.storage().ref()
      const fileRef = storageRef.child(file.name)
      await fileRef.put(file)
      setFileUrl(await fileRef.getDownloadURL())
    }

    let location = useLocation()
    const emailRef = useRef()

    const handleLogin = useCallback(
        async event => {
            var actionCodeSettings = {
                url: window.location.origin + location.pathname,
                handleCodeInApp:true
            };
            // event.preventDefault();
            // console.log(emailRef.current.value, " type: " ,typeof(emailRef.current.value))
            try {
                await firebase.auth()
                    .sendSignInLinkToEmail(emailRef.current.value,actionCodeSettings)
                window.localStorage.setItem("emailForSignIn",emailRef.current.value);
                // fetch('https://us-central1-firestore-web-12fc1.cloudfunctions.net/firestoreToAlgoliaSubCollection')
                history.push("/activate");
            } catch(error){
                alert(error)
            }
        },
        [history]
    )

    useEffect(() => {

        db.collection("partner").onSnapshot((snapshot)=>{
           //console.log(snapshot.docs.map(doc => ({id:doc.id, partnername:doc.data().partner_name})))
           partnerList(snapshot.docs.map((doc) =>({
              id:doc.id,
              name:doc.data().partner_name,
              tel:doc.data().partner_phone_number,
              category:doc.data().category,
              address:doc.data().partner_address,
              website:doc.data().partner_website,
              linkedin:doc.data().partner_linkedin
           })))
        })
    
        db.collectionGroup("partnerglobal").onSnapshot((snapshot) => {
            setPartnerglobal(snapshot.docs.map((doc) => ({
                id:doc.id,
                average_size:doc.data().average_project_size,
                certified:doc.data().certified,
                client_focus:doc.data().client_focus,
                data_readiness:doc.data().data_readiness,
                locations:doc.data().global_locations,
                industry_focus:doc.data().industry_focus,
                matrix:doc.data().leader_matrix,
                master_services:doc.data().master_services_agreement,
                nondisclosure:doc.data().nondisclosure_agreement,
                price:doc.data().pricing_model,
                rating:doc.data().rating,
                resources:doc.data().resources_available,
                reviews_desc:doc.data().reviews_description,
                service_tech:doc.data().service_technology,
                testimonial_desc:doc.data().testimonials_description
            })))
        })
        
        db.collectionGroup("partnerusecase").onSnapshot((snapshot) => {
            setUsecase(snapshot.docs.map((doc) => ({
                id:doc.id,
                description:doc.data().service_use_case_description,
                epic:doc.data().use_case_epic
            })))
        })
        
        // for (var i=0; i<partnerData.length;i++){
        //     console.log(partnerData[i].name)
        //     console.log(partnerglobalData[i].client_focus)
        //     console.log(parnterUsecase[i].epic)
        // }
        
    },[])

    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);

    const { emailAddress } = useContext(AuthContext);

    const [dropvalue, setDropvalue] = useState("")
    
    
    const [date, setDate] = useState(new Date());
    const [fullDate, setFullDate] = useState("")
    const handleCalendarClose = () => console.log("Calendar closed");
    const handleCalendarOpen = () => console.log("Calendar opened");
    
    useEffect(() => {
        const DayTime = String(date).split(" ")
        setFullDate(DayTime[0] + " " + DayTime[1] + " " + DayTime[2] + " " + DayTime[3] + " " + DayTime[6])
    },[date])
    
    return(
    <div>
        <div className="partnerNetwork"><h1 className="partnerTitle">Partners</h1></div>
        <h1 style={customStyle}>AIC Partner</h1>
            
            <div style={{textAlign:"center"}}>
                <input className="partnerSearch" type="text" placeholder="Search Partner"/>
                <img className="searchicon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyLjAwNSA1MTIuMDA1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIuMDA1IDUxMi4wMDU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNTA1Ljc0OSw0NzUuNTg3bC0xNDUuNi0xNDUuNmMyOC4yMDMtMzQuODM3LDQ1LjE4NC03OS4xMDQsNDUuMTg0LTEyNy4zMTdjMC0xMTEuNzQ0LTkwLjkyMy0yMDIuNjY3LTIwMi42NjctMjAyLjY2Nw0KCQkJUzAsOTAuOTI1LDAsMjAyLjY2OXM5MC45MjMsMjAyLjY2NywyMDIuNjY3LDIwMi42NjdjNDguMjEzLDAsOTIuNDgtMTYuOTgxLDEyNy4zMTctNDUuMTg0bDE0NS42LDE0NS42DQoJCQljNC4xNiw0LjE2LDkuNjIxLDYuMjUxLDE1LjA4Myw2LjI1MXMxMC45MjMtMi4wOTEsMTUuMDgzLTYuMjUxQzUxNC4wOTEsNDk3LjQxMSw1MTQuMDkxLDQ4My45MjgsNTA1Ljc0OSw0NzUuNTg3eg0KCQkJIE0yMDIuNjY3LDM2Mi42NjljLTg4LjIzNSwwLTE2MC03MS43NjUtMTYwLTE2MHM3MS43NjUtMTYwLDE2MC0xNjBzMTYwLDcxLjc2NSwxNjAsMTYwUzI5MC45MDEsMzYyLjY2OSwyMDIuNjY3LDM2Mi42Njl6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" />
                {/* <TextField id="standard-secondary" label="Please Search" color="secondary" style={{width:"500px"}}/> */}
            </div>
            {/* {emailAddress === "partner" || emailAddress === "admin" ? parnterUsecase.map(data => (
                <div key={data.id} style={{margin:"40px 70px 40px"}}>
                    <h3 style={{textAlign:"left"}}>{data.epic}</h3>
                    <p>{data.description}</p>
                </div>
            )) 
            :
            <Alert variant="danger" style={{margin:"40px 40px"}}>
            <div style={{textAlign:"left",margin:"10px 10px"}}>
                <h2>Partner Registration Alert!</h2>
                <hr/>
                <h6>You can not view this page. You need the sign up as a client user to view this page. Please <u>JOIN OUR NETWORK.</u></h6>
            </div> 
            </Alert>
            }  */}
            <div style={{textAlign:"center",marginBottom:"20px"}}>
                <button className="buton" onClick={() => setLgShow(true)}>JOIN OUR NETWORK</button>
            </div>

            <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Partner Sign Up Form 
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-area">
                {/* <h1>Partner Sign Up Form</h1> */}
                <Row>
                <Col>
                    <label className="partner-label">Partner Name</label>
                    <input className="partner-input" {...register("partnerName",{required:true})}/>
                    {errors.partnerName && <p className="p-p">This input is required</p>}
                    
                    <label className="partner-label">Category</label>
                    <select className="form-select" {...register("category",{required:true})}>
                        <option selected value={null} disabled>Please Select</option>
                        <option value="AIaas">AIaas</option>
                        <option value="MLass">MLasS</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Talent Augmentation">Talent Augmentation</option>
                    </select>
                    {errors.category && <p className="p-p">Please select one.</p>}
                </Col>
                <Col>
                <img className="company-logo" src={fileUrl} height="150" width="200"/>
                    
                <input className="partner-input file-change" type="file" onChange={onFileChange}/>
                 
                {/* <button className="partner-button"style={{marginTop:"0"}} onClick={handleUpload}>Upload</button> */}

                </Col>
                </Row>

                <Row>
                    <Col>
                    <label className="partner-label">Partner Phone Number</label>
                    <input className="partner-input" {...register("phoneNumber",{required:true})}/>
                    {errors.phoneNumber && <p className="p-p">This input is required</p>}
                    </Col>
                    <Col>
                    <label className="partner-label">Date Founded</label>
                    <DatePicker
                        className="datepicker"
                        selected={date}
                        onChange={date => setDate(date)}
                        onCalendarClose={handleCalendarClose}
                        onCalendarOpen={handleCalendarOpen}
                    />
                    </Col>
                </Row>

                

                <label className="partner-label">Partner Address</label>
                <input className="partner-input" {...register("addressLine",{required:true})} placeholder="Street Address"/>
                {errors.addressLine && <p className="p-p">This input is required</p>}
                <Row>
                <Col>
                    <input className="partner-input" placeholder="City" {...register("addressCity",{required:true})}/>
                    {errors.addressCity && <p className="p-p">This input is required</p>}
                </Col>
                <Col>
                    <input className="partner-input" placeholder="State/Provience" {...register("addressSP",{required:true})}/>
                    {errors.addressSP && <p className="p-p">This input is required</p>}
                </Col>
                </Row>
                <input className="partner-input" placeholder="Postal / Zip Code" {...register("addressZip",{required:true})}/>
                {errors.addressZip && <p className="p-p">This input is required</p>}

                <label className="partner-label">Partner Website</label>
                <input className="partner-input" style={{width:"60%"}} {...register("website",{required:true})}/>
                {errors.website && <p className="p-p">This input is required</p>}

                <label className="partner-label">Partner Linkedin</label>
                <input className="partner-input" {...register("linkedin",{required:true})}/>
                {errors.linkedin && <p className="p-p">This input is required</p>}

                <label className="partner-label">Partner Twitter</label>
                <input className="partner-input" {...register("twitter",{required:true})}/>
                {errors.twitter && <p className="p-p">This input is required</p>}

                <Row>
                <Col>
                    <label className="partner-label">Contact Title</label>
                    <input className="partner-input" {...register("contactTitle",{required:true})}/>
                    {errors.contactTitle && <p className="p-p">This input is required</p>}
                </Col>
                <Col>
                    <label className="partner-label">Contact Name</label>
                    <input className="partner-input" {...register("contactName",{required:true})}/>
                    {errors.contactName && <p className="p-p">This input is required</p>}
                </Col>
                </Row>

                <label className="partner-label">Contact Email</label>
                <input className="partner-input" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" placeholder="ex: myname@example.com" {...register("contactEmail",{ required:true})} ref={emailRef}/>
                {errors.contactEmail?.type === "required" && <p className="p-p">This input is required</p>}
                
                <Row>
                <Col>
                    <label className="partner-label">Company Size Range?</label>
                    <select className="form-select" {...register("sizeRange",{required:true})}>
                        <option selected value={null} disabled>Please Select</option>
                        <option>Freelancer</option>
                        <option>2 - 9</option>
                        <option>10 - 49</option>
                        <option>50 - 249</option>
                        <option>250 - 999</option>
                        <option>1000+</option>
                    </select>
                </Col>

                <Col>
                    <label className="partner-label">Venture Funding</label>
                    <select className="form-select" {...register("ventureFunding",{required:true})}>
                        <option selected value={null} disabled>Please Select</option>
                        <option>Seed</option>
                        <option>Series A</option>
                        <option>Series B</option>
                        <option>Series C</option>
                        <option>Series C+</option>
                        <option>Public</option>
                        <option>Option 6</option>
                        <option>Other</option>
                    </select>
                </Col>
                </Row>
                
                <label className="partner-label">List Other Global Locations (City, Country)?</label>
                <input className="partner-input" {...register("location",{required:true})}/>
                {errors.location && <p className="p-p">This input is required.</p>}

                <label className="partner-label">What is the Client Data Readiness Required?</label>
                <div className="checkbox-box">
                <div>
                    <label className="checkbox-label partner-label">
                    <input className="checkbox-input" type="checkbox"/><span>Identified</span></label>
                </div>
                <div>
                    <label className="checkbox-label partner-label">
                    <input className="checkbox-input" type="checkbox"/><span>Prepared</span></label>
                </div>
                <div>
                    <label className="checkbox-label partner-label">
                    <input className="checkbox-input" type="checkbox"/><span>Enriched and transformed</span></label>
                </div>
                <div>
                    <label className="checkbox-label partner-label">
                    <input className="checkbox-input" type="checkbox"/><span>Operationalized</span></label>
                </div>
                <div>
                    <label className="checkbox-label partner-label">
                    <input className="checkbox-input" type="checkbox"/><span>N/A</span></label>
                </div>
                </div>

                <Row>
                <Col>
                <label className="partner-label">What are your AI Service Technologies? </label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Machine Learning</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Deep Learning</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Decision Management</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Content Creation</span></label>
                    </div> 
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Virtual Agents / Chatbots</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>IoT / AI Optimized Hardware</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Natural Language Processing (NLP)</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Speech Recognition</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Computer Vision / Image Recognition</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Emotion Recognition</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Biometrics</span></label>
                    </div>
                    <div>
                    <label className="checkbox-label partner-label">
                    <input className="checkbox-input" type="checkbox"/><span>Robotic Process Automation (RPA)</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                    <input className="checkbox-input" type="checkbox"/><span>Marketing Automation</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Big Data</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Option 15</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                    </div>
                </div>
                </Col>
                <Col>
                <label className="partner-label">Please select Client Focus?</label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Small business</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Midsize</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Enterprise</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Reseller</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                    </div>
                </div>
                <label className="partner-label">Please select Industry Focus?</label>
                <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Retail</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Consumer Packaged Goods</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Healthcare</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Information Technology</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Professional and Business Services</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Finance and Insurance</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Real Estate</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Government</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Manufacturing</span></label>
                    </div>
                </div>
                </Col>
                </Row>

                <label className="partner-label">What is your Use Case or Solution Name?</label>
                <input className="partner-input" {...register("usecaseEpic",{required:true})}/>
                {errors.usecaseEpic && <p className="p-p">This input is required.</p>}

                <label className="partner-label">Describe your Use Case or Solution for a Client?</label>
                <input className="partner-input" {...register("usecaseDesc",{required:true})}/>
                {errors.usecaseDesc && <p className="p-p">This input is required.</p>}

                <label className="partner-label">What are your Resources Available? </label>
                    <div className="checkbox-box">
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Junior Data Scientist</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Data Scientist</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Senior Data Scientist</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/>
                        <span>Junior Software Engineer [Front-end / Back-end]</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/>
                        <span>Software Engineer [Front-end / Back-end]</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/>
                        <span>Senior Software Engineer [Front-end / Back-end]</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>DevOps Engineer</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Senior DevOps Engineer</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Technical Leader</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Analyst / ETL</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Project Manager</span></label>
                    </div>
                    <div>
                        <label className="checkbox-label partner-label">
                        <input className="checkbox-input" type="checkbox"/><span>Other</span></label>
                    </div>
                </div>
                
                <Row>
                    <Col>
                        <label className="partner-label">Pricing Model</label>
                        <input className="partner-input" {...register("pricingModel",{required:true})}/>
                        {errors.pricingModel && <p className="p-p">This input is required.</p>}
                    </Col>
                    <Col>
                        <label className="partner-label">Reviews Description</label>
                        <input className="partner-input" {...register("reviewsDesc",{required:true})}/>
                        {errors.reviewsDesc && <p className="p-p">This input is required.</p>}
                    </Col>
                </Row>

                <label className="partner-label">Please describe Average Project Size?</label>
                <select className="form-select" {...register("projectSize",{required:true})}>
                    <option selected disabled value={null}>Please Select</option>
                    <option value="1000+">1000+</option>
                    <option value="5000+">5000+</option>
                    <option value="10000+">10000+</option>
                    <option value="25000+">25000+</option>
                    <option value="50000+">50000+</option>
                </select>

                <input className="partner-input" type="submit"/>
            </div>
            </form>
            
            </Modal.Body>
            {/* <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button variant="primary" disabled={!emailItem} onClick={handleLogin} type="submit">Add Partner Data</Button>
            </Modal.Footer> */}
            </Modal>

            {/* {emailAddress === "partner" || emailAddress === "admin" && partnerglobalData.map(item => (
                <div style={partnerStyle} key={item.id}>
                    <div>Global Locations : {typeof(item.locations) === "string" ? item.locations : item.locations.join(", ")}</div>
                    <div>Industry Focus : {typeof(item.industry_focus) === "string" ? item.industry_focus : item.industry_focus.join(", ")}</div>
                    <div>Rating : {item.rating}</div>
                    <div style={{paddingBottom:"10px"}}>Resources Available : {item.resources}</div>
                </div>
            ))} */}
    </div>
        
    );
} 

export default withRouter(Partner)