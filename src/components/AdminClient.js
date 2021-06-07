/* eslint-disable react-hooks/rules-of-hooks */
import React,{useState,useEffect, useContext} from 'react'
import algoliasearch from "algoliasearch";
import {
    InstantSearch,
    Hits,
    SearchBox,
    Pagination,
    Highlight,
    ClearRefinements,
    RefinementList,
    Configure,
    connectHitInsights
} from "react-instantsearch-dom"
import PropTypes from "prop-types";
import "../css/adminpartnerstyles.css";
import db from "../firebase";
import {Modal, Button} from "react-bootstrap";

const searchClient = algoliasearch(
    "JODMEMNWNW",
    "846d255s5d2v6we6wef5g8erg7",
)


const HitWithInsights = connectHitInsights(window.aa)(Hit);

export default function AdminClient() {

    // const {emailAddress} = useContext(AuthContext);

    // if (emailAddress !== "admin"){
    //   return <Redirect to="/myaccount"/>
    // }

    return (
        <div className="container-fluid">
            <div className="ais-InstantSearch">
                <h1>AI Collaborator Client Network</h1>
                <InstantSearch indexName="client" searchClient={searchClient}>
                <div className="left-panel">
                    <ClearRefinements/>
                    <h6>AI Tools</h6>
                    <RefinementList attribute="clientusecase.ai_tools"/>
                    <Configure hitsPerPage={8}/>
                    <h6>Service Technology</h6>
                    <RefinementList attribute="clientusecase.service_technology"/>
                    <Configure hitsPerPage={8}/>
                </div>
                <div className="right-panel">
                    <SearchBox/>
                    <Hits hitComponent={HitWithInsights}/>
                    <Pagination/>
                </div>
                <Configure clickAnalytics/>
                </InstantSearch>
            </div>
        </div>
    )
}

function Hit(props){
    const [lgShow,setLgShow] = useState(false)
    const [clientData, setClientData] = useState("")
    const [clientGlobal, setClientGlobal] = useState("")
    const [clientUsecase, setClientUsecase] = useState("")

    useEffect(() => {
        db.collection("client").doc(props.hit.objectID)
            .onSnapshot((doc) => {
                setClientData({
                    id:doc.id,
                    name:doc.data().client_name,
                    address:doc.data().client_address,
                    contact_email:doc.data().client_contact_email,
                    contact_title:doc.data().client_contact_title,
                    linkedin:doc.data().client_linkedin,
                    phone_number:doc.data().client_phone_number,
                    twitter:doc.data().client_twitter,
                    website:doc.data().client_website,
                    data_created:doc.data().data_created,
                    data_updated:doc.data().data_updated,
                    date_founded:doc.data().date_founded,
                    contact_name:doc.data().client_contact_name
                })
            })

        db.collection("client").doc(props.hit.objectID).collection("clientglobal")
            .doc(props.hit.clientglobal.clientglobalID).onSnapshot((doc) => {
                setClientGlobal({
                    certified:doc.data().certified,
                    client_focus:doc.data().client_focus,
                    // minimum_project_size:doc.data().minimum_project_size,
                    industry_focus:doc.data().industry_focus
                    
                })
            })
        
        db.collection("client").doc(props.hit.objectID).collection("clientusecase")
            .doc(props.hit.clientusecase.clientusecaseID).onSnapshot((doc) => {
                setClientUsecase({
                    ai_tools:doc.data().ai_tools,
                    cloud_infrastructure:doc.data().cloud_infrastructure,
                    ethical_and_legal_issues:doc.data().ethical_and_legal_issues,
                    measure_of_success:doc.data().measure_of_succes,
                    objective:doc.data().objective,
                    service_technology:doc.data().service_technology,
                    strategic_goal:doc.data().strategic_goal,
                    use_case_description:doc.data().use_case_description,
                    use_case_epic:doc.data().use_case_epic
                })
            })

    }, [props.hit.clientglobal.clientglobalID, props.hit.clientusecase.clientusecaseID, props.hit.objectID])

    // useEffect(() => {
    //     // var myDate = new Date(props.hit.data_created._seconds*1000)
    //     // var formatedTime = myDate.toJSON()
    //     // console.log(formatedTime)
        
          
    //     const fireBaseTime = new Date(
    //       props.hit.data_created._seconds * 1000 + props.hit.data_created._nanoseconds / 1000000,
    //     );
    //     const date = fireBaseTime.toDateString();
    //     const atTime = fireBaseTime.toLocaleTimeString();
    
    //     console.log(date, atTime);
    // }, [props.hit.data_created._nanoseconds, props.hit.data_created._seconds])
    

    const [openUpdate, setOpenUpdate] = useState(false);
    const [input, setInput] = useState();

    const [hitName, setHitName] = useState();
    const [show, setShow] = useState(false);
    const [fieldName, setFieldName] = useState();
    const [modalTitle, setModalTitle] = useState();

    const handleClose = () => setShow(false);

    function handleShow(){
        setShow(true);
        setModalTitle("Image Update");
        setHitName(props.hit.imageURL)
    }

    const updateTodo = () => {
        db.collection("client").doc(props.hit.objectID).set({
            imageURL:input
        },{merge:true})
        handleClose()
    }

    return(
        
        <div className="card">
            <img
                className="img-thumbnail img-fluid img-responsive"
                src={props.hit.imageURL}
                alt={props.hit.objectID}
                width="200px"
                align="left"
                height="200px"
            />
            <div className="card-body">
                <h5>Company :</h5>
                <div className="hit-objectID">
                    <h2>
                        <Highlight attribute="client_name" hit={props.hit}/>
                    </h2>
                </div>
                <br/>
                <h5>Use Case Epic :</h5>
                <div className="hit-objectID">
                    <span>
                        {props.hit.clientusecase.use_case_epic}
                    </span>
                </div>
                <br/>
                <h5>Use Case Description :</h5>
                <div className="hit-objectID">
                    <p>
                        {props.hit.clientusecase.use_case_description}
                    </p>
                </div>
                <button onClick={() => setLgShow(true)} className="more-button">More Information</button>
            </div>
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Client Data
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul style={{listStyleType:"none",textAlign:"left"}}>
                        <img
                            className="img-thumbnail img-fluid img-responsive"
                            src={props.hit.imageURL}
                            alt={props.hit.objectID}
                            width="200px"
                            align="right"
                            height="200px"
                            onClick={handleShow}
                            style={{cursor:"pointer"}}
                        />
                        {/* <button className="img__update">Update Image</button> */}
                        <li className="line">
                            <b>Client Name : </b>{clientData.name}
                        </li>
                        <li className="line">
                            <b>Client Number : </b>{clientData.phone_number}
                        </li>
                        <li className="line">
                            <b>Client Address : </b>{clientData.address}
                        </li>
                        <li className="line">
                            <b>Client Contact Title : </b>{clientData.contact_title}
                        </li>
                        <li className="line">
                            <b>Client Contact Name : </b>{clientData.contact_name}
                        </li>
                        <li className="line">
                            <b>Client Contact Email : </b>{clientData.contact_email}
                        </li>
                        <li className="line">
                            <b>Website : </b>{clientData.website}
                        </li>
                        <li className="line">
                            <b>Linkedin : </b>{clientData.linkedin}
                        </li>
                        <li className="line">
                            <b>Twitter : </b>{clientData.twitter}
                        </li>
                        <li className="line">
                            <b>Certified : </b>{clientGlobal.certified}
                        </li>
                        <li className="line">
                            <b>Client Focus : </b>{clientGlobal.client_focus}
                        </li>
                        <li className="line">
                            <b>Industry Focus : </b>{clientGlobal.industry_focus}
                        </li>
                        <li className="line">
                            <b>AI Tools : </b>{clientUsecase.ai_tools}
                        </li>
                        <li className="line">
                            <b>Cloud Infrastructure : </b>{clientUsecase.cloud_infrastructure}
                        </li>
                        <li className="line">
                            <b>Ethical and Legal Issues : </b>{clientUsecase.ethical_and_legal_issues}
                        </li>
                        <li className="line">
                            <b>Measure of Succes : </b>{clientUsecase.measure_of_succes}
                        </li>
                        <li className="line">
                            <b>Objective : </b>{clientUsecase.objective}
                        </li>
                        <li className="line">
                            <b>Service Technology : </b>{clientUsecase.service_technology}
                        </li>
                        <li className="line">
                            <b>Strategic Goal : </b>{clientUsecase.strategic_goal}
                        </li>
                        <li className="line">
                            <b>Use Case Epic : </b>{clientUsecase.use_case_epic}
                        </li>
                        <li className="line">
                            <b>Use Case Description : </b>{clientUsecase.use_case_description}
                        </li>
                    </ul>
                </Modal.Body>
            </Modal>
                    <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <input
                  className="modal__input"
                  type="text"
                  placeholder={hitName}
                  value={input}
                  onChange={(Event) => setInput(Event.target.value)}
                />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateTodo} disabled={!input} type="submit">
                        Update The Partner Data
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}