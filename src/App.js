/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */

import './App.css';
import db,{firebase} from "./firebase";
import Footer from "./components/footer";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Nav from "./components/Nav"
import Partner from "./components/partner";
import Client from "./components/client";
import React, {useEffect,useState} from "react";
import PartnerFrom from "./components/partnerform";
import ClientForm from "./components/clientform";
import Carousel from 'react-bootstrap/Carousel'
// import aicvideo from "./images/AiCollaboratorV1.5.mp4";
import Myaccount from './components/myaccount';
import AuthProvider from './context/Auth';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { ActivatePage } from './components/Activate.page';
import Admin from './components/Admin';
import AdminPartner from './components/AdminPartner';
import AdminClient from './components/AdminClient';


function App() {


//   useEffect(() => {
//     db.collection("partner").get().then(querySnap=>{
//       querySnap.forEach(doc=>{
         
//           if (doc.data().partnerglobal != null){
//               const partnerData = doc.data().partnerglobal;
//               db.collection("partner/" + doc.id + "/partnerglobal").add({
//                   average_project_size:partnerData.average_project_size,
//                   certified:partnerData.certified,
//                   client_focus:partnerData.client_focus,
//                   data_readiness:partnerData.data_readiness,
//                   global_locations:partnerData.global_locations,
//                   industry_focus:partnerData.industry_focus,
//                   leader_matrix:partnerData.leader_matrix,
//                   master_services_agreement:partnerData.master_services_agreement,
//                   nondisclosure_agreement:partnerData.nondisclosure_agreement,
//                   pricing_model:partnerData.pricing_model,
//                   rating:partnerData.rating,
//                   reseller_agreement:partnerData.reseller_agreement,
//                   resources_available:partnerData.resources_available,
//                   reviews_description:partnerData.reviews_description,
//                   service_technology:partnerData.service_technology,
//                   testimonials_description:partnerData.testimonials_description
//               })
              
//               db.collection("partner").doc(doc.id).update({
//                   partnerglobal: firebase.firestore.FieldValue.delete()
//               })

//               db.collection("partner").doc(doc.id).update({
//                   data_created:firebase.firestore.FieldValue.serverTimestamp()
//               })
  
//           }if (doc.data().partnerusecase != null){
//               //usecase başka fonksiyona ayır
//               const usecaseData = doc.data().partnerusecase;
  
//               db.collection("partner/" + doc.id + "/partnerusecase").add({
//                   service_use_case_description:usecaseData.service_use_case_description,
//                   use_case_epic:usecaseData.use_case_epic
//               })
  
//               db.collection("partner").doc(doc.id).update({
//                   partnerusecase:firebase.firestore.FieldValue.delete()
//               })
//           }
//       })
//   })
  
  
//   db.collection("client").get().then((querySnap=>{
//       querySnap.forEach((doc)=>{
        
//         if (doc.data().clientglobal != null){
//             const clientglobalData = doc.data().clientglobal;
//             db.collection("client/" + doc.id + "/clientglobal").add({
//                 certified:clientglobalData.certified,
//                 client_focus:clientglobalData.client_focus,
//                 industry_focus:clientglobalData.industry_focus,
//                 minimum_project_size:clientglobalData.minimum_project_size
//             })

//             db.collection("client").doc(doc.id).update({
//                 clientglobal:firebase.firestore.FieldValue.delete()
//             })

//             db.collection("client").doc(doc.id).update({
//                 data_created:firebase.firestore.FieldValue.serverTimestamp()
//             })

//         }if(doc.data().clientusecase != null){
//             const usecaseData = doc.data().clientusecase;
//             db.collection("client/" + doc.id + "/clientusecase").add({
//                 ai_tools:usecaseData.ai_tools,
//                 cloud_infrastructure:usecaseData.cloud_infrastructure,
//                 ethical_and_legal_issues:usecaseData.ethical_and_legal_issues,
//                 measure_of_success:usecaseData.measure_of_success,
//                 objective:usecaseData.objective,
//                 service_technology:usecaseData.service_technology,
//                 strategic_goal:usecaseData.strategic_goal,
//                 use_case_description:usecaseData.use_case_description,
//                 use_case_epic:usecaseData.use_case_epic
//             })

//             db.collection("client").doc(doc.id).update({
//                 clientusecase: firebase.firestore.FieldValue.delete()
//             })
//         }
//       })
//   }))
//   },[])

  return(
  <div className="App">
    <AuthProvider>
     <Router>
        <Nav/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/admin" component={Admin}/>
          <Route path="/partner" component={Partner}/>
          <Route path="/client" component={Client}/>
          <Route path="/partnerform" component={PartnerFrom}/>
          <Route path="/clientform" component={ClientForm}/>
          <PrivateRoute path="/myaccount" component={Myaccount}/>
          <Route path="/login" component={Login}/>
          <Route path="/activate" component={ActivatePage}/>
          <Route path="/adminpartner" component={AdminPartner}/>
          <Route path="/adminclient" component={AdminClient}/>
        </Switch>
        </Router>
        <Footer/>
    </AuthProvider>
  </div>)
}

const Home = () => {

  return (
    <>
      <Carousel>
        <Carousel.Item>
          <video
            className="d-block w-100 h-100"
            src="https://v401.aicollaborator.com/wp-content/uploads/2020/09/AiCollaboratorV1.5.mp4"
            alt="Second slide"
            autoPlay={true}
            height="700"
            loop={true}
          />

          <Carousel.Caption>
            <h3>Transforming How Forward-Looking Enterprises Deploy AI</h3>
            <p>Second slide label</p>
          </Carousel.Caption>
        </Carousel.Item>

      </Carousel>
      <div className="textContainer">
        <span className="textItem">
        Transforming How Forward-Looking Enterprises Deploy AI
        </span>
      </div>
    </>
  )
}
export default App;
