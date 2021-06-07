/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React,{useContext, useEffect,useState} from 'react'
import db, {firebase} from "../firebase";

export default function Myaccount() {
    let user = firebase.auth().currentUser;

    const [account,setAccount] = useState("")
    const [userRole, setUserRole] = useState("")

    const [partnerData,partnerList] = useState("")
    const [partnerglobalData,setPartnerglobal] = useState("")
    const [parnterUsecase, setUsecase] = useState([])

    const [clientData,setclientData] = useState([])
    const [clientGlobalData, setClientGlobalData] = useState([])
    const [clientUsecase, setClientUsecase] = useState([])

    useEffect(()=> {

        ["partner","client"].map((collection) => 
            db.collection(collection).get().then((snapshot)=> {
                snapshot.forEach((doc) => {
                    if (doc.data().partner_contact_email === user.email){
                        console.log("Parnter email is matched: ",doc.data().partner_contact_email)
                        setAccount(collection.charAt(0).toUpperCase() + collection.slice(1))
                        setUserRole(collection)
                        db.collection("partner").doc(doc.id)
                            .onSnapshot((doc) => {
                                partnerList({
                                    id:doc.id,
                                    name:doc.data().partner_name,
                                    address:doc.data().partner_address,
                                    category:doc.data().category,
                                    data_created_sec:doc.data().data_created.seconds,
                                    data_created_nano:doc.data().data_created.nanoseconds,
                                    data_updated:doc.data().data_updated,
                                    date_founded:String(doc.data().date_founded),
                                    contact_email:doc.data().partner_contact_email,
                                    contact_title:doc.data().partner_contact_title,
                                    contact_name:doc.data().partner_contact_name,
                                    linkedin:doc.data().partner_linkedin,
                                    twitter:doc.data().partner_twitter,
                                    phone:doc.data().partner_phone_number,
                                    size:doc.data().partner_size,
                                    website:doc.data().partner_website,
                                    venture_funding:doc.data().venture_funding
                                })
                            })

                        db.collection("partner").doc(doc.id).collection("partnerglobal")
                            .get().then((snapshot) => {
                                snapshot.forEach((doc) => {
                                    setPartnerglobal({
                                        id:doc.id,
                                        average_size:doc.data().average_project_size,
                                        certified:doc.data().certified,
                                        client_focus:doc.data().client_focus,
                                        data_readiness:doc.data().data_readiness,
                                        locations:doc.data().global_locations,
                                        master_services:doc.data().master_services_agreement,
                                        nondisclosure:doc.data().nondisclosure_agreement,
                                        price:doc.data().pricing_model,
                                        rating:doc.data().rating,
                                        resources:doc.data().resources_available,
                                        reviews_desc:doc.data().reviews_description,
                                        service_tech:doc.data().service_technology,
                                        testimonial_desc:doc.data().testimonials_description
                                })
                            })
                        })

                        db.collection("partner").doc(doc.id).collection("partnerusecase")
                            .get().then((snapshot) => {
                                snapshot.forEach((doc) => {
                                    setUsecase({
                                        id:doc.id,
                                        description:doc.data().service_use_case_description,
                                        epic:doc.data().use_case_epic
                                })
                            })
                        })

                    }else if (doc.data().client_contact_email === user.email){
                        console.log("Client email is matched: ",doc.data().client_contact_email)
                        setAccount(collection.charAt(0).toUpperCase() + collection.slice(1))
                        setUserRole(collection)
                        db.collection("client").doc(doc.id)
                            .onSnapshot((doc) => {
                                setclientData({
                                    id:doc.id,
                                    name:doc.data().client_name,
                                    address:doc.data().client_address,
                                    contact_email:doc.data().client_contact_email,
                                    contact_title:doc.data().client_contact_title,
                                    linkedin:doc.data().client_linkedin,
                                    phone_number:doc.data().client_phone_number,
                                    twitter:doc.data().client_twitter,
                                    website:doc.data().client_website,
                                    data_created:String(doc.data().data_created),
                                    data_updated:doc.data().data_updated,
                                    date_founded:doc.data().date_founded,
                                    contact_name:doc.data().client_contact_name
                            })
                        })

                        db.collection("client").doc(doc.id).collection("clientusecase")
                            .get().then((snapshot) => {
                                snapshot.forEach((doc) => {
                                    setClientUsecase({
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
                                })
                            })
                        })
                                
                        db.collection("client").doc(doc.id).collection("clientglobal")
                            .get().then((snapshot) => {
                                snapshot.forEach((doc) => {
                                    setClientGlobalData({
                                    id:doc.id,
                                    certified:doc.data().certified,
                                    client_focus:doc.data().client_focus,
                                    industry_focus:doc.data().industry_focus
                                })
                            })
                        })
                        
                    }
                })
            })
        )

        db.collection("admin").get().then((snapshot)=> {
            snapshot.forEach((doc) => {
                if (doc.data().admin_email === user.email){
                    setAccount("ADMIN")
                }
            })
        })
        
    },[])

    const [dateString, setDateString] = useState("")

    useEffect(() => {
            const fireBaseTime = new Date(
              partnerData.data_created_sec * 1000 + partnerData.data_created_nano / 1000000,
            );
            const datetime = fireBaseTime.toDateString();
            const atTime = fireBaseTime.toLocaleTimeString();
            setDateString(datetime + " " + atTime)
    }, [partnerData])
    // console.log("Display Name: ",firebase.auth().    currentUser.displayName)
    return (
        <div style={{textAlign:"center"}}>
            <h1><u>{account}</u> Account</h1>
            <button onClick={() => alert(firebase.auth().currentUser.email)}>Show Email</button>
            <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
            
            {userRole === "partner" && 
            <div key={partnerData.id}>
                {account && <h2>{account} Contact Information</h2>}
                <ul style={{listStyleType:"none",textAlign:"left"}}>
                    <li></li>
                    <li><b>Partner Name : </b>{partnerData.name}</li>
                    <li><b>Phone Number : </b>{partnerData.phone}</li>
                    <li><b>Address : </b>{partnerData.address}</li>
                    <li><b>Partner Contact Name : </b>{partnerData.contact_name}</li>
                    <li><b>Partner Contact Email : </b>{partnerData.contact_email}</li>
                    <li><b>Partner Contact Title : </b>{partnerData.contact_title}</li>
                    <li><b>Website : </b>{partnerData.website}</li>
                    <li><b>Linkedin : </b>{partnerData.linkedin}</li>
                    <li><b>Twitter : </b>{partnerData.twitter}</li>
                    <li><b>Partner Size : </b>{partnerData.size}</li>
                    <li><b>Venture Funding : </b>{partnerData.venture_funding}</li>
                    <li><b>Data Founded : </b>{partnerData.date_founded}</li>
                    <li><b>Data Created : </b>{dateString}</li>
                    <li><b>Data Updated : </b>{partnerData.data_updated}</li>
                </ul>
                {account && <h2>{account} Details</h2>}
                <ul style={{listStyleType:"none",textAlign:"left"}}>
                    <li><b>Average Project Size : </b>{partnerglobalData.average_size}</li>
                    <li><b>Certified : </b>{partnerglobalData.certified}</li>
                    <li><b>Client Focus : </b>{partnerglobalData.client_focus}</li>
                    <li><b>Data Readiness : </b>{partnerglobalData.data_readiness}</li>
                    <li><b>Global Locations : </b>{partnerglobalData.locations}</li>
                    <li><b>Master Services Agreement : </b>{partnerglobalData.master_services}</li>
                    <li><b>Non-Disclousure Agreement : </b>{partnerglobalData.nondisclosure}</li>
                    <li><b>Pricing Model : </b>{partnerglobalData.price}</li>
                    <li><b>Rating : </b>{partnerglobalData.rating}</li>
                    <li><b>Resources Available : </b>{partnerglobalData.resources}</li>
                    <li><b>Reviews Description : </b>{partnerglobalData.reviews_desc}</li>
                    <li><b>Service Technology : </b>{partnerglobalData.service_tech}</li>
                    <li><b>Testimonial Description : </b>{partnerglobalData.testimonial_desc}</li>
                </ul>
                {account && <h2>{account} Use Case Information</h2>}
                <ul style={{listStyleType:"none",textAlign:"left"}}>
                    <li><b>Use Case Epic : </b>{parnterUsecase.epic}</li>
                    <li><b>Use Case Description : </b>{parnterUsecase.description}</li>
                </ul>
            </div>}
            {userRole === "client" && 
            <div key={clientData.id}>
                {account && <h2>{account} Contact Information</h2>}
                <ul style={{listStyleType:"none",textAlign:"left"}}>
                    <li><b>Client Name : </b>{clientData.name}</li>
                    <li><b>Phone Number : </b>{clientData.phone_number}</li>
                    <li><b>Client Address : </b>{clientData.address}</li>
                    <li><b>Client Contact Name : </b>{clientData.contact_name}</li>
                    <li><b>Client Contact Title : </b>{clientData.contact_title}</li>
                    <li><b>Client Contact Email : </b>{clientData.contact_email}</li>
                    <li><b>Website : </b>{clientData.website}</li>
                    <li><b>Linkedin : </b>{clientData.linkedin}</li>
                    <li><b>Twitter : </b>{clientData.twitter}</li>
                    <li><b>Date Founded : </b>{clientData.date_founded}</li>
                    <li><b>Data Created : </b>{clientData.data_created}</li>
                    <li><b>Data Updated : </b>{clientData.data_updated}</li>
                </ul>
                {account && <h2>{account} Details</h2>}
                <ul style={{listStyleType:"none",textAlign:"left"}}>
                    <li><b>Certified : </b>{clientGlobalData.certified}</li>
                    <li><b>Client Focus : </b>{clientGlobalData.client_focus}</li>
                    <li><b>Industry Focus : </b>{clientGlobalData.industry_focus}</li>
                </ul>
                {account && <h2>{account} Use Case Information</h2>}
                <ul style={{listStyleType:"none",textAlign:"left"}}>
                    <li><b>Use Case Epic : </b>{clientUsecase.epic}</li>
                    <li><b>Objective : </b>{clientUsecase.objective}</li>
                    <li><b>Strategic Goal : </b>{clientUsecase.goal}</li>
                    <li><b>Service Technologies : </b>{clientUsecase.service_tech}</li>
                    <li><b>Measure of Success : </b>{clientUsecase.kpi}</li>
                    <li><b>Ethical and Legal Issue : </b>{clientUsecase.issue}</li>
                    <li><b>AI Tools : </b>{clientUsecase.ai_tools}</li>
                    <li><b>Cloud Infrastructure : </b>{clientUsecase.cloud_inf}</li>
                    <li><b>Use Case Description : </b>{clientUsecase.desc}</li>
                </ul>
            </div>}
        </div>
    )
}
