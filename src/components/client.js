/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React,{useState, useEffect, useCallback, useRef, useContext} from "react";
import db,{firebase} from "../firebase";
import {Link, useLocation, withRouter} from "react-router-dom";
import "../css/style.css";
import { Form, Button, Modal, Container, Row, Col, Alert } from 'react-bootstrap';
import { AuthContext } from "../context/Auth";


function Client({history}){   
    const [clientData, setClientData] = useState([])
    const [clientUsecase, setClientUsecase] = useState([])

    const customStyle = {
        color: "#CA4B88",
        fontSize:"40px",
        textAlign:"center",
        marginTop:"20px"
    }

    const clientStyle = {
        color:"black",
        textAlign:"left",
        padding:"10px 10px 10px ",
        margin:"10px 20px 10px",
        borderStyle:"groove"
    }

    const formStyle = {
        alignItems: "center",
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
            // console.log(emailRef.current.value, " type: " ,typeof(emailRef.current.value))
            try {
                await firebase.auth()
                    .sendSignInLinkToEmail(emailRef.current.value,actionCodeSettings)
                window.localStorage.setItem("emailForSignIn",emailRef.current.value);
                AddClient()
                history.push("/activate");
            } catch(error){
                alert(error)
            }
        },
        [history]
    )

    const AddClient = () => {
        
        const checkList = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[]}
        const checkbox = document.querySelectorAll(".checkbox-box")
        for (var i=0; i<checkbox.length;i++){   
            for (var a=0; a < checkbox[i].getElementsByTagName("input").length;a++){      
                if (checkbox[i].getElementsByTagName("input")[a].checked === true){
                    checkList[i].push(checkbox[i].getElementsByTagName("span")[a].innerHTML)
                }
            }
        }

        const obj = {}
        const form = document.querySelectorAll("input.form-control")
        for (var i=0; i<form.length;i++){
            obj[i] = form[i].value
        }

        const radioList = []
        const radio = document.querySelector(".radio-container").getElementsByTagName("input")
        for (var i=0; i<radio.length;i++){
            if (radio[i].checked === true){
                radioList.push(radio[i].value)
            }
        }

        console.log(checkList)
        console.log(obj)
        console.log(radioList)

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
            date_founded:obj[12],
            clientglobal:{
                certified:radioList[0],
                client_focus:checkList[5],
                industry_focus:checkList[3],
                minimum_project_size:"There is no title in form"
            },
            clientusecase:{
                ai_tools:checkList[2],
                cloud_infrastructure:checkList[4],
                ethical_and_legal_issues:checkList[0],
                measure_of_success:obj[14],
                objective:obj[11],
                service_technology:checkList[1],
                strategic_goal:obj[10],
                use_case_description:obj[16],
                use_case_epic:obj[15]
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
    } 
    
    useEffect(() => {
        db.collectionGroup("clientusecase").onSnapshot((snapshot) => {
            setClientUsecase(snapshot.docs.map((doc) => ({
                id:doc.id,
                ai_tools:doc.data().ai_tools,
                cloud_inf:doc.data().cloud_infrastructure,
                issue:doc.data().ethical_and_legal_issues,
                kpi:doc.data().measure_of_success,
                objective:doc.data().objective,
                service_tech:doc.data().service_technology,
                goal:doc.data().strategic_goal,
                description:doc.data().use_case_description,
                epic:doc.data().use_case_epic
            })))
        })

    },[])
    
    useEffect(() => {
        db.collectionGroup("clientglobal").onSnapshot((snapshot) => {
            setClientData(snapshot.docs.map((doc) => ({
                id:doc.id,
                certified:doc.data().certified,
                client_focus:doc.data().client_focus,
                industry_focus:doc.data().industry_focus,
                min_size:doc.data().minimum_project_size
            })))
        })
    },[])

    const [lgShow, setLgShow] = useState(false);
    const handleClose = () => setLgShow(false);

    const { emailAddress } = useContext(AuthContext);

    return(
        <div>
            <div className="clientNetwork"><h1 className="clientTitle">Clients</h1></div>
            <h1 style={customStyle}>AIC Client</h1>
            <div style={{textAlign:"center"}}>
                <input className="partnerSearch" type="text" placeholder="Search Client"/>
                <img className="searchicon" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyLjAwNSA1MTIuMDA1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIuMDA1IDUxMi4wMDU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNTA1Ljc0OSw0NzUuNTg3bC0xNDUuNi0xNDUuNmMyOC4yMDMtMzQuODM3LDQ1LjE4NC03OS4xMDQsNDUuMTg0LTEyNy4zMTdjMC0xMTEuNzQ0LTkwLjkyMy0yMDIuNjY3LTIwMi42NjctMjAyLjY2Nw0KCQkJUzAsOTAuOTI1LDAsMjAyLjY2OXM5MC45MjMsMjAyLjY2NywyMDIuNjY3LDIwMi42NjdjNDguMjEzLDAsOTIuNDgtMTYuOTgxLDEyNy4zMTctNDUuMTg0bDE0NS42LDE0NS42DQoJCQljNC4xNiw0LjE2LDkuNjIxLDYuMjUxLDE1LjA4Myw2LjI1MXMxMC45MjMtMi4wOTEsMTUuMDgzLTYuMjUxQzUxNC4wOTEsNDk3LjQxMSw1MTQuMDkxLDQ4My45MjgsNTA1Ljc0OSw0NzUuNTg3eg0KCQkJIE0yMDIuNjY3LDM2Mi42NjljLTg4LjIzNSwwLTE2MC03MS43NjUtMTYwLTE2MHM3MS43NjUtMTYwLDE2MC0xNjBzMTYwLDcxLjc2NSwxNjAsMTYwUzI5MC45MDEsMzYyLjY2OSwyMDIuNjY3LDM2Mi42Njl6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=" />
            </div>
            {/* <div style={{textAlign:"center"}}>
                <Link to="/clientform"><button className="buton">Start your AI Collaboration</button></Link>
            </div> */}
        
            {/* {emailAddress === "client" || emailAddress ==="admin" && clientUsecase.map((usecase) => (
                <div key={usecase.id} style={{margin:"10px 20px 10px"}}>
                    <h3>{usecase.epic}</h3>
                    <p>{usecase.description}</p>
                </div>
            )) 
            
            }

            {emailAddress === "client" || emailAddress ==="admin" ? clientData.map((clientItem) => (
                <div key={clientItem.id} style={clientStyle}>
                   <div>Certified : {clientItem.certified}</div> 
                   <div>Client Focus : {typeof(clientItem.client_focus) === "string" ? clientItem.client_focus :clientItem.client_focus.join(", ")}</div>
                   <div>Industry Focus : {clientItem.industry_focus.join(", ")}</div>
                   <div>Minimum Project Size : {clientItem.min_size}</div>
                   <div>Rating : {clientItem.rating}</div>
                </div>
            ))
            : 
            <Alert variant="danger" style={{margin:"40px 40px"}}>
                <div style={{textAlign:"left",margin:"10px 10px"}}>
                    <h2>Client Registration Alert!</h2>
                    <hr/>
                    <h6>You can not view this page. You need the sign up as a client user to view this page. Please <u>Start your AI Collaboration.</u></h6>
                </div> 
            </Alert>
            } */}

            <div style={{textAlign:"center",marginBottom:"20px"}}>
                <button className="buton" onClick={() => setLgShow(true)}>Start your AI Collaboration</button>
            </div>
            <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
            >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Client Sign Up Form 
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                <Form>
                <Row>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Name?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Address?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Phone Number?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Website?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Linkedin?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Client Twitter?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Contact Name?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Contact Title?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Contact Email?</Form.Label>
                    <Form.Control type="email" ref={emailRef} value={emailItem} onChange={Event => setEmailItem(Event.target.value)}></Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>List Other Global Locations (City, Country)?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the Strategic Goal of AI Adoption?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the Objective of this AI Project?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Date Founded?</Form.Label>
                    <Form.Control type="text" required></Form.Control>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the Key Stakeholders Roles?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    </Col>
                </Row>
                <Form.Group style={formStyle}>
                <Form.Label style={{ marginBottom: "10px" }}>Describe the KPIs and Targets for Success Measurement?</Form.Label>
                <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Row>
                <Col>
                <div className="modal_checkbox-container">
                    <label>Select any Business, Ethical and Compliance Priorities?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Explainability</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Bias</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Privacy</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>GDPR</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>AI Policy</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>AI Literacy</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>AI Traininig</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Workforce Management</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Other</span></label>
                        </div>
                    </div>
                </div>
                </Col>
                <Col>
                <fieldset id="group1" className="radio-container" style={{marginTop:"20px"}}>
                    <label>Certified?</label>
                    <div>
                        <label className="radio-label"><input type="radio" value="Yes" name="group1"/>
                        <span>Yes</span></label>
                    </div>
                    <div>
                        <label className="radio-label"><input type="radio" value="No" name="group1"/>
                        <span>No</span></label>
                    </div>
                </fieldset>
                </Col>
                </Row>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>What is the Use Case Epic or Solution Name?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe the AI Use Case or Solution desired?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                {/* <Row>
                    <Col>
                    <div className="modal_checkbox-container">
                        <label>Select the Project Type?</label>
                        <div className="checkbox-box">
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Pilot</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Operationalizatio</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Privacy</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/>
                                <span>Center of Excellence Service Provider</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Staff Augmentation</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Other</span></label>
                            </div>
                        </div>
                    </div>
                    </Col>
                    <Col>
                    <div className="modal_checkbox-container">
                        <label>What is the Client Data Readiness Anticipated?</label>
                        <div className="checkbox-box">
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Identified</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Prepared</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Enriched and transformed</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>Operationalized</span></label>
                            </div>
                            <div>
                                <label className="checkbox-label">
                                <input type="checkbox"/><span>N/A</span></label>
                            </div>
                        </div>
                    </div>
                    </Col>
                </Row> */}
                
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe any Startup Network Partner Restrictions or Disqualifying Criteria?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                <Row>
                <Col>
                <div className="modal_checkbox-container">
                    <label>What are your AI Service Technologies?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Machine Learning</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Deep Learning</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Decision Management</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Content Creation</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Virtual Agents / Chatbots</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>IoT / AI Optimized Hardware</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Natural Language Processing (NLP)</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Speech Recognition</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Computer Vision / Image Recognition</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Emotion Recognition</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Biometrics</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Robotic Process Automation (RPA)</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Marketing Automation</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Big Data</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Option 15</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Other</span></label>
                        </div>
                    </div>
                </div>
                </Col>
                <Col>
                <div className="modal_checkbox-container">
                    <label>Please select supported AI Tools and Frameworks?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Scikit Learn</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>TensorFlow</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Theano</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Caffe</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>MxNet</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Keras</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>PyTorch</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>CNTK</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Auto ML</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>OpenNN</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>H20: Open Source AI Platform</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Google ML Kit</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Other</span></label>
                        </div>
                    </div>
                </div>
                </Col>
                </Row>
                {/* <Row>
                <Col>
                <div className="modal_checkbox-container">
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
                </Col>
                <Col>
                <div className="modal_checkbox-container">
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
                </Col>
                </Row> */}
                <Row>
                <Col>
                <div className="modal_checkbox-container">
                    <label>Please select Industry Focus?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Retail</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Consumer Packaged Goods</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Healthcare</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Manufacturing</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Information Technology</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Professional and Business Services</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Finance and Insurance</span></label>
                        </div> 
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Real Estate</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Government</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Other</span></label>
                        </div>
                    </div>
                </div>
                </Col>   
                <Col>
                <div className="modal_checkbox-container">
                    <label>Please select supported Cloud Infrastructure?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/>
                            <span>Amazon Web Services (AWS)</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Google Cloud Platform (GCP)</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Microsoft Azure</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Private</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>N/A</span></label>
                        </div>
                    </div>
                </div>
                <div className="modal_checkbox-container">
                    <label>Please select Client Focus?</label>
                    <div className="checkbox-box">
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Small business</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Midsize</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Enterprise</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Reseller</span></label>
                        </div>
                        <div>
                            <label className="checkbox-label">
                            <input type="checkbox"/><span>Other</span></label>
                        </div>
                    </div>
                </div>
                </Col>
                </Row>
                <Form.Group style={formStyle}>
                    <Form.Label style={{ marginBottom: "10px" }}>Describe Client desired Service Delivery Timeframe (ex. Pilot parameters)?</Form.Label>
                    <Form.Control type="text"></Form.Control>
                </Form.Group>
                </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" disabled={!emailItem} onClick={handleLogin} type="submit">
                    Add Client Data
                </Button>
            </Modal.Footer>
            </Modal>
        </div>
    )
}

export default withRouter(Client);

