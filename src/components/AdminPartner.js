/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
import React,{useState,useEffect} from 'react'
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
    connectHitInsights,
    Menu
} from "react-instantsearch-dom"
import PropTypes from 'prop-types';
import "../css/adminpartnerstyles.css";
import db,{firebase,app} from "../firebase";
import {Modal,Button} from "react-bootstrap";

const searchClient = algoliasearch(
    "JODMEMNWNW",
    "846d255s5d2v6we6wef5g8erg7",
)

const HitWithInsights = connectHitInsights(window.aa)(Hit);

export default function AdminPartner() {
    
    // const {emailAddress} = useContext(AuthContext);

    // if (emailAddress !== "admin"){
    //   return <Redirect to="/myaccount"/>
    // }


    return (
        <div className="container-fluid">
        <div className="ais-InstantSearch">
            <h1>Ai Collaborator Partner Network</h1>
            <p>Find your ideal Collaborative Enterprise AI Partner</p>
            <InstantSearch indexName="partner" searchClient={searchClient}>
            <div className="left-panel">
                <ClearRefinements/>
                <h6>Category</h6>
                <RefinementList attribute="category"/>
                <Configure hitsPerPage={8}/>
                <h6>Date Founded</h6>
                <RefinementList attribute="date_founded"/>
                <Configure hitsPerPage={8}/>
            </div>
            <div className="right-panel">
                <SearchBox/>
                <Hits hitComponent={HitWithInsights} />
                <Pagination/>
            </div>
            <Configure clickAnalytics/>
            </InstantSearch>
        </div>
        </div>
    )
}

function Hit(props) {
    const [lgShow,setLgShow] = useState(false)
    const [data, setData] = useState("")
    const [global, setGlobal] = useState("")
    const [usecase, setUsecase] = useState("")

    useEffect(() => {
        // Real time read the data
        db.collection("partner").doc(props.hit.objectID)
            .onSnapshot((doc) => {
                setData({
                    id:doc.id,
                    name:doc.data().partner_name,
                    address:doc.data().partner_address,
                    category:doc.data().category,
                    data_created:String(doc.data().data_created),
                    data_updated:doc.data().data_updated,
                    date_founded:doc.data().date_founded,
                    contact_email:doc.data().partner_contact_email,
                    contact_title:doc.data().partner_contact_title,
                    contact_name:doc.data().partner_contact_name,
                    linkedin:doc.data().partner_linkedin,
                    twitter:doc.data().partner_twitter,
                    phone:doc.data().partner_phone_number,
                    size:doc.data().partner_size,
                    website:doc.data().partner_website,
                    venture_funding:doc.data().venture_funding,
                    imageURL:doc.data().imageURL
            })
        })

        // the subcollection id will put here (props.hit.partnerglobal.partnerglobalID) then it will work as real time
        db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
            .doc(props.hit.partnerglobal.partnerglobalID).onSnapshot((doc) => {
              setGlobal({
                average_size:doc.data().average_project_size,
                certified:doc.data().certified,
                client_focus:doc.data().client_focus,
                data_readiness:doc.data().data_readiness,
                locations:doc.data().global_locations,
                industry_focus:doc.data().industry_focus,
                master_services:doc.data().master_services_agreement,
                nondisclosure:doc.data().nondisclosure_agreement,
                price:doc.data().pricing_model,
                rating:doc.data().rating,
                resources:doc.data().resources_available,
                reviews_desc:doc.data().reviews_description,
                reseller:doc.data().reseller_agreement,
                service_tech:doc.data().service_technology,
                testimonial_desc:doc.data().testimonials_description
            })
        })
          
        db.collection("partner").doc(props.hit.objectID).collection("partnerusecase")
            .doc(props.hit.partnerusecase.partnerusecaseID).onSnapshot((doc) => {
                setUsecase({
                description:doc.data().service_use_case_description,
                epic:doc.data().use_case_epic
            })
        })
        
    },[props.hit.objectID, props.hit.partnerglobal.partnerglobalID, props.hit.partnerusecase.partnerusecaseID])
      
    const [hitName, setHitName] = useState()
    const [show, setShow] = useState(false);
    const [fieldName, setFieldName] = useState()
    const [modalTitle, setModalTitle] = useState()

    const handleClose = () => setShow(false);
    // const handleShow = (data) => setShow(true);
    function handleShow(){
      setShow(true);
      setHitName(props.hit.partner_name)
      setFieldName("partner_name")
      setModalTitle("Partner Name")
    }

    function handleShow0(){
      handleShowDrop()
      setHitName(props.hit.category)
      setFieldName("category")
      setModalTitle("Category")
    }

    function handleShow1(){
      setShow(true);
      setHitName(props.hit.partner_phone_number)
      setFieldName("partner_phone_number")
      setModalTitle("Partner Phone Number")
    }

    function handleShow2(){
      setShow(true);
      setHitName(props.hit.partner_address)
      setFieldName("partner_address")
      setModalTitle("Partner Address")
    }

    function handleShow3(){
      setShow(true);
      setHitName(props.hit.partner_contact_name)
      setFieldName("partner_contact_name")
      setModalTitle("Partner Contact Name")
    }

    function handleShow4(){
      setShow(true);
      setHitName(props.hit.partner_contact_email)
      setFieldName("partner_contact_email")
      setModalTitle("Partner Contact Email")
    }

    function handleShow5(){
      setShow(true);
      setHitName(props.hit.partner_contact_title)
      setFieldName("partner_contact_title")
      setModalTitle("Partner Contact Title")
    }

    function handleShow6(){
      setShow(true);
      setHitName(props.hit.partner_website)
      setFieldName("partner_website")
      setModalTitle("Partner Website")
    }

    function handleShow7(){
      setShow(true);
      setHitName(props.hit.partner_linkedin)
      setFieldName("partner_linkedin")
      setModalTitle("Partner Linkedin")
    }

    function handleShow8(){
      setShow(true);
      setHitName(props.hit.partner_twitter)
      setFieldName("partner_twitter")
      setModalTitle("Partner Twitter")
    }

    function handleShow9(){
      // setShow(true);
      handleShowRadio()
      setHitName(props.hit.partner_size)
      setFieldName("partner_size")
      setModalTitle("Partner Size")
    }

    function handleShow10(){
      handleShowRadio1()
      setHitName(props.hit.venture_funding)
      setFieldName("venture_funding")
      setModalTitle("Venture Funding")
    }

    function handleShow11(){
      handleShowCheckbox3()
      setHitName(props.hit.partnerglobal.service_technology)
      setFieldName("service_technology")
      setModalTitle("Service Technology")
    }

    function handleShow12(){
      handleShowRadio3()
      setHitName(props.hit.partnerglobal.certified)
      setFieldName("certified")
      setModalTitle("Certified")
    }

    function handleShow13(){
      handleShowCheckbox()
      setHitName(props.hit.partnerglobal.client_focus)
      setFieldName("client_focus")
      setModalTitle("Client Focus")
    }

    function handleShow14(){
      handleShowRadio2()
      setHitName(props.hit.partnerglobal.average_project_size)
      setFieldName("average_project_size")
      setModalTitle("Average Project Size")
    }

    function handleShow15(){
      handleShowCheckbox1()
      setHitName(props.hit.partnerglobal.data_readiness)
      setFieldName("data_readiness")
      setModalTitle("Data Readiness")
    }

    function handleShow16(){
      setShow(true);
      setHitName(props.hit.partnerglobal.global_locations)
      setFieldName("global_locations")
      setModalTitle("Global Locations")
    }

    function handleShow17(){
      handleShowRadio3()
      setHitName(props.hit.partnerglobal.master_services_agreement);
      setFieldName("master_services_agreement");
      setModalTitle("Master Service Aggrement");
    }

    function handleShow18(){
      handleShowRadio3()
      setHitName(props.hit.partnerglobal.nondisclosure_agreement);
      setFieldName("nondisclosure_agreement")
      setModalTitle("Non-discloure Agreement")
    }

    function handleShow19(){
      setShow(true);
      setHitName(props.hit.partnerglobal.pricing_model)
      setFieldName("pricing_model")
      setModalTitle("Pricing Model")
    }

    function handleShow30(){
      handleShowRating()
      setHitName(props.hit.partnerglobal.rating)
      setFieldName("rating")
      setModalTitle("Rating")
    }

    function handleShow22(){
      handleShowCheckbox4()
      setHitName(props.hit.partnerglobal.resources_available)
      setFieldName("resources_available")
      setModalTitle("Resources Available")
    }

    function handleShow23(){
      setShow(true)
      setHitName(props.hit.partnerglobal.reviews_description)
      setFieldName("reviews_description")
      setModalTitle("Reviews Description")
    }

    function handleShow24(){
      handleShowRadio3()
      setHitName(props.hit.partnerglobal.testimonials_description)
      setFieldName("testimonials_description")
      setModalTitle("Testimonials Description")
    }

    function handleShow20(){
      setShow(true);
      setHitName(props.hit.partnerusecase.use_case_epic)
      setFieldName("use_case_epic")
      setModalTitle("Use Case Epic")
    }

    function handleShow21(){
      setShow(true);
      setHitName(props.hit.partnerusecase.service_use_case_description)
      setFieldName("service_use_case_description")
      setModalTitle("Service Use Case Description")
    }

    function handleShow25(){
      handleShowCheckbox2()
      setHitName(props.hit.partnerglobal.industry_focus)
      setFieldName("industry_focus")
      setModalTitle("Industry Focus")
    }

    function handleShow26(){
      handleShowRadio3()
      setHitName(props.hit.partnerglobal.reseller_agreement)
      setFieldName("reseller_agreement")
      setModalTitle("Reseller Agreement")
    }

    function handleShow31(){
      setShowImg(true);
      setHitName(props.hit.imageURL);
      setFieldName("imageURL");
      setModalTitle("Company Logo (Select the Image File)");
    }

    const [ImgFile, setImgFile] = useState("")

    const onFileChange = async(e) => {
      const file = e.target.files[0]
      // const storageRef = app.storage().ref()
      // const fileRef = storageRef.child(file.name)
      // await fileRef.put(file)
      setImgFile(file)
    }

    const handleUpload = async() => {
      const storageRef = app.storage().ref()
      const fileRef = storageRef.child(ImgFile.name)
      await fileRef.put(ImgFile)
      const fileURL = await fileRef.getDownloadURL()
      db.collection("partner").doc(props.hit.objectID).set({
        imageURL:fileURL
      },{merge:true})
      handleCloseImg()
    }

    const [openUpdate, setOpenUpdate] = useState(false);
    const [input, setInput] = useState();

    const updateTodo = () => {

      switch(fieldName){
        case "partner_name":
        db.collection("partner").doc(props.hit.objectID).set(
          {
            partner_name:input
          },
          {merge:true});
        break;
        case "partner_phone_number":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_phone_number:input
            },
            {merge:true});
            break;
        case "partner_address":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_address:input
            },
            {merge:true});
            break;
        case "category":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              category:currentValue
            },
            {merge:true});
            handleCloseDrop()
            break;
        case "partner_contact_email":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_contact_email:input
            },
            {merge:true});
            break;
        case "partner_contact_name":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_contact_name:input
            },
            {merge:true});
            break;
        case "partner_contact_title":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_contact_title:input
            },
            {merge:true});
            break;
        case "partner_linkedin":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_linkedin:input
            },
            {merge:true});
            break;
        case "partner_size":
          const radioList = {0:[]}
          const radio = document.querySelectorAll(".radio-container")
          for (var a=0; a<radio[0].getElementsByTagName("input").length;a++){
            if (radio[0].getElementsByTagName("input")[a].checked === true){
                radioList[0].push(radio[0].getElementsByTagName("input")[a].value)
            }
          }
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_size:radioList[0][0]
            },
            {merge:true});
          handleCloseRadio()
          break;
        case "venture_funding":
          const radioList1 = {0:[]}
          const radio1 = document.querySelectorAll(".radio-container")
          for (var a=0; a<radio1[0].getElementsByTagName("input").length;a++){
            if (radio1[0].getElementsByTagName("input")[a].checked === true){
                radioList1[0].push(radio1[0].getElementsByTagName("input")[a].value)
            }
          }
          db.collection("partner").doc(props.hit.objectID).set(
            {
              venture_funding:radioList1[0][0]
            },
            {merge:true});
            handleCloseRadio1()
            break;
        case "partner_twitter":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_twitter:input
            },
            {merge:true});
            break;
        case "partner_website":
          db.collection("partner").doc(props.hit.objectID).set(
            {
              partner_website:input
            },
            {merge:true});
            break;
        case "service_technology":
          const checkList3 = {0:[]}
          const checkbox3 = document.querySelectorAll(".checkbox-box")
          
          for (var a=0; a < checkbox3[0].getElementsByTagName("input").length;a++){      
              if (checkbox3[0].getElementsByTagName("input")[a].checked === true){
                  checkList3[0].push(checkbox3[0].getElementsByTagName("span")[a].innerHTML)
              }
          }
          const partnerRef3 = db.collection("partner").doc(props.hit.objectID)
          .collection("partnerglobal").doc(props.hit.partnerglobal.partnerglobalID)

            if (checkList3[0].length === 1){
            partnerRef3.set({
              service_technology:checkList3[0][0]
            },{merge:true})
          }else{
            partnerRef3.set({
              service_technology:checkList3[0]
            },{merge:true})
          }
          handleCloseCheckbox3()
          break;
        case "certified":
          const radioList4 = {0:[]}
          const radio4 = document.querySelectorAll(".radio-container1")
          for (var a=0; a<radio4[0].getElementsByTagName("input").length;a++){
            if (radio4[0].getElementsByTagName("input")[a].checked === true){
                radioList4[0].push(radio4[0].getElementsByTagName("input")[a].value)
            }
          }
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
            .doc(props.hit.partnerglobal.partnerglobalID).set(
            {
              certified:radioList4[0][0]
            },
            {merge:true});
            handleCloseRadio3()
            break;
        case "client_focus":
          const checkList = {0:[]}
          const checkbox = document.querySelectorAll(".checkbox-box")
          
          for (var a=0; a < checkbox[0].getElementsByTagName("input").length;a++){      
              if (checkbox[0].getElementsByTagName("input")[a].checked === true){
                  checkList[0].push(checkbox[0].getElementsByTagName("span")[a].innerHTML)
              }
          }
          const partnerRef = db.collection("partner").doc(props.hit.objectID)
          .collection("partnerglobal").doc(props.hit.partnerglobal.partnerglobalID)

            if (checkList[0].length === 1){
            partnerRef.set({
              client_focus:checkList[0][0]
            },{merge:true})
          }else{
            partnerRef.set({
              client_focus:checkList[0]
            },{merge:true})
          }
          handleCloseCheckbox()
          break;
        case "average_project_size":
          const radioList2 = {0:[]}
          const radio2 = document.querySelectorAll(".radio-container")
          for (var a=0; a<radio2[0].getElementsByTagName("input").length;a++){
            if (radio2[0].getElementsByTagName("input")[a].checked === true){
                radioList2[0].push(radio2[0].getElementsByTagName("input")[a].value)
            }
          }
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
            .doc(props.hit.partnerglobal.partnerglobalID).set(
            {
              average_project_size:radioList2[0][0]
            },
            {merge:true});
            handleCloseRadio2()
            break;
        case "data_readiness":
          const checkList1 = {0:[]}
          const checkbox1 = document.querySelectorAll(".checkbox-box")
          
          for (var a=0; a < checkbox1[0].getElementsByTagName("input").length;a++){      
              if (checkbox1[0].getElementsByTagName("input")[a].checked === true){
                  checkList1[0].push(checkbox1[0].getElementsByTagName("span")[a].innerHTML)
              }
          }
          const partnerRef1 = db.collection("partner").doc(props.hit.objectID)
          .collection("partnerglobal").doc(props.hit.partnerglobal.partnerglobalID)

          if (checkList1[0].length === 1){
            partnerRef1.set({
              data_readiness:checkList1[0][0]
            },{merge:true})
          }else{
            partnerRef1.set({
              data_readiness:checkList1[0]
            },{merge:true})
          }
          handleCloseCheckbox1()
          break;
        case "industry_focus":
          const checkList2 = {0:[]}
          const checkbox2 = document.querySelectorAll(".checkbox-box")

          for (var a=0; a < checkbox2[0].getElementsByTagName("input").length;a++){      
              if (checkbox2[0].getElementsByTagName("input")[a].checked === true){
                  checkList2[0].push(checkbox2[0].getElementsByTagName("span")[a].innerHTML)
              }
          }
          const partnerRef2 = db.collection("partner").doc(props.hit.objectID)
          .collection("partnerglobal").doc(props.hit.partnerglobal.partnerglobalID)

          if (checkList2[0].length === 1){
            partnerRef2.set({
              industry_focus:checkList2[0][0]
            },{merge:true})
          }else{
            partnerRef2.set({
              industry_focus:checkList2[0]
            },{merge:true})
          }
          handleCloseCheckbox2()
          break;
        case "global_locations":
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
              .doc(props.hit.partnerglobal.partnerglobalID).set({
                global_locations:input
              },{merge:true});
              break;
        case "master_services_agreement":
          const radioList5 = {0:[]}
          const radio5 = document.querySelectorAll(".radio-container1")
          for (var a=0; a<radio5[0].getElementsByTagName("input").length;a++){
            if (radio5[0].getElementsByTagName("input")[a].checked === true){
                radioList5[0].push(radio5[0].getElementsByTagName("input")[a].value)
            }
          }
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
              .doc(props.hit.partnerglobal.partnerglobalID).set({
                master_services_agreement:radioList5[0][0]
              },{merge:true});
              handleCloseRadio3()
              break;
        case "nondisclosure_agreement":
          const radioList6 = {0:[]}
          const radio6 = document.querySelectorAll(".radio-container1")
          for (var a=0; a<radio6[0].getElementsByTagName("input").length;a++){
            if (radio6[0].getElementsByTagName("input")[a].checked === true){
                radioList6[0].push(radio6[0].getElementsByTagName("input")[a].value)
            }
          }
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
              .doc(props.hit.partnerglobal.partnerglobalID).set({
                nondisclosure_agreement:radioList6[0][0]
              },{merge:true});
              handleCloseRadio3()
              break;
        case "use_case_epic":
          db.collection("partner").doc(props.hit.objectID).collection("partnerusecase")
            .doc(props.hit.partnerusecase.partnerusecaseID).set(
            {
              use_case_epic:input
            },
            {merge:true});
            break;
        case "service_use_case_description":
          db.collection("partner").doc(props.hit.objectID).collection("partnerusecase")
            .doc(props.hit.partnerusecase.partnerusecaseID).set(
            {
              service_use_case_description:input
            },
            {merge:true});
            break;
        case "pricing_model":
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
            .doc(props.hit.partnerglobal.partnerglobalID).set(
            {
              pricing_model:input
            },
            {merge:true});
            break;
        case "rating":
          const ratingItem = Number(document.getElementsByName("quantity")[0].value)
          console.log(typeof(ratingItem))
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
            .doc(props.hit.partnerglobal.partnerglobalID).set({
              rating:ratingItem
            },{merge:true});
            handleCloseRating()
            break;
        case "reviews_description":
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
            .doc(props.hit.partnerglobal.partnerglobalID).set({
              reviews_description:input
            },{merge:true});
            break;
        case "reseller_agreement":
          const radioList7 = {0:[]}
          const radio7 = document.querySelectorAll(".radio-container1")
          for (var a=0; a<radio7[0].getElementsByTagName("input").length;a++){
            if (radio7[0].getElementsByTagName("input")[a].checked === true){
                radioList7[0].push(radio7[0].getElementsByTagName("input")[a].value)
            }
          }
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
            .doc(props.hit.partnerglobal.partnerglobalID).set({
              reseller_agreement:radioList7[0][0]
            },{merge:true})
            handleCloseRadio3();
            break;
        case "testimonials_description":
          const radioList8 = {0:[]}
          const radio8 = document.querySelectorAll(".radio-container1")
          for (var a=0; a<radio8[0].getElementsByTagName("input").length;a++){
            if (radio8[0].getElementsByTagName("input")[a].checked === true){
                radioList8[0].push(radio8[0].getElementsByTagName("input")[a].value)
            }
          }
          db.collection("partner").doc(props.hit.objectID).collection("partnerglobal")
            .doc(props.hit.partnerglobal.partnerglobalID).set({
              testimonials_description:radioList8[0][0]
            },{merge:true});
            handleCloseRadio3()
            break;
        case "resources_available":
          const checkList4 = {0:[]}
          const checkbox4 = document.querySelectorAll(".checkbox-box")
          
          for (var a=0; a < checkbox4[0].getElementsByTagName("input").length;a++){      
              if (checkbox4[0].getElementsByTagName("input")[a].checked === true){
                  checkList4[0].push(checkbox4[0].getElementsByTagName("span")[a].innerHTML)
              }
          }
          const partnerRef4 = db.collection("partner").doc(props.hit.objectID)
          .collection("partnerglobal").doc(props.hit.partnerglobal.partnerglobalID)

            if (checkList4[0].length === 1){
            partnerRef4.set({
              resources_available:checkList4[0][0]
            },{merge:true})
          }else{
            partnerRef4.set({
              resources_available:checkList4[0]
            },{merge:true})
          }
          handleCloseCheckbox4()
          break;
        // case "imageURL":
        //   db.collection("partner").doc(props.hit.objectID).set({
        //       imageURL:input
        //   },{merge:true});
        //   break;
        default:
          db.collection("partner").doc(props.hit.objectID).set(
            {
              reviews_description:input
            },
            {merge:true});
      }
      handleClose();
    }
    // Radio Component
    const [showRadio, setShowRadio] = useState(false);
    const handleCloseRadio = () => setShowRadio(false);
    const handleShowRadio = () => setShowRadio(true);

    const [showRadio1, setShowRadio1] = useState(false);
    const handleCloseRadio1 = () => setShowRadio1(false);
    const handleShowRadio1 = () => setShowRadio1(true);

    const [showRadio2, setShowRadio2] = useState(false);
    const handleCloseRadio2 = () => setShowRadio2(false);
    const handleShowRadio2 = () => setShowRadio2(true);

    const [showRadio3, setShowRadio3] = useState(false);
    const handleCloseRadio3 = () => setShowRadio3(false);
    const handleShowRadio3 = () => setShowRadio3(true);

    // Checkbox Component
    const [showCheckbox, setShowCheckbox] = useState(false);
    const handleCloseCheckbox = () => setShowCheckbox(false);
    const handleShowCheckbox = () => setShowCheckbox(true);

    const [showCheckbox1, setShowCheckbox1] = useState(false);
    const handleCloseCheckbox1 = () => setShowCheckbox1(false);
    const handleShowCheckbox1 = () => setShowCheckbox1(true);

    const [showCheckbox2, setShowCheckbox2] = useState(false);
    const handleCloseCheckbox2 = () => setShowCheckbox2(false);
    const handleShowCheckbox2 = () => setShowCheckbox2(true);

    const [showCheckbox3, setShowCheckbox3] = useState(false);
    const handleCloseCheckbox3 = () => setShowCheckbox3(false);
    const handleShowCheckbox3 = () => setShowCheckbox3(true);

    const [showCheckbox4, setShowCheckbox4] = useState(false);
    const handleCloseCheckbox4 = () => setShowCheckbox4(false);
    const handleShowCheckbox4 = () => setShowCheckbox4(true);

    const [showRating, setShowRating] = useState(false);
    const handleCloseRating = () => setShowRating(false);
    const handleShowRating = () => setShowRating(true);

    const [showDrop, setShowDrop] = useState(false)
    const handleCloseDrop = () => setShowDrop(false)
    const handleShowDrop = () => setShowDrop(true)

    const [showImg, setShowImg] = useState(false);
    const handleCloseImg = () => setShowImg(false);
    const handleShowImg = () => setShowImg(true);

    const [currentValue, setCurrentValue] = useState();

    function handleChange(event){
      setCurrentValue(event.target.value)
    }

    return(
        <div className="card">
            <img
                className="img-thumbnail img-fluid img-responsive"
                src={data.imageURL} //src={props.hit.imageURL}
                alt={props.hit.objectID}
                width="200px"
                align="left"
                height="200px"
            />
            <div className="card-body">
                <h5>Company :</h5>
                <div className="hit-objectID">
                    <h2>
                        <Highlight attribute="partner_name" hit={props.hit} />
                    </h2>
                </div>
                <br></br>
                <h5>Description :</h5>
                <div className="hit-objectID">
                    <p>
                        {props.hit.partnerusecase.service_use_case_description}
                    </p> 
                </div>
                <br></br>
                <h5>Industry :</h5>
                <div className="hit-objectID">
                    <span>
                        {typeof(props.hit.partnerglobal.industry_focus) === "string" ? 
                        props.hit.partnerglobal.industry_focus
                        :
                        props.hit.partnerglobal.industry_focus.join(", ")
                        }
                    </span>
                </div>
                <div>
                <button onClick={()=> setLgShow(true)} className="more-button">More Information</button>
                </div>
            </div>
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

      <Modal show={showImg} onHide={handleCloseImg}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
          type="file"
          onChange={onFileChange}
          style={{marginBottom:"15px"}}
          />
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseImg}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpload} disabled={!ImgFile}>
              Update The Partner Data
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      {/* Radio Modal Component for partner_size */}
      <Modal show={showRadio} onHide={handleCloseRadio}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <fieldset id="group1" className="radio-container">
            <label>Company Size Range?</label>
            <div>
                <label className="radio-label"><input type="radio" value="Freelancer" name="group1"/>
                <span>Freelancer</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="2 - 9" name="group1"/>
                <span>2 - 9</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="10 - 49" name="group1"/>
                <span>10 - 49</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="50 - 249" name="group1"/>
                <span>50 - 249</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="250 - 999" name="group1"/>
                <span>250 - 999</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="1000+" name="group1"/>
                <span>1000+</span></label>
            </div>
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRadio}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Radio Modal Component for venture_funding */}
      <Modal show={showRadio1} onHide={handleCloseRadio1}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <fieldset id="group2" className="radio-container">
            <label>Venture Funding?</label>
            <div>
                <label className="radio-label"><input type="radio" value="Seed" name="group2"/>
                <span>Seed</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="Series A" name="group2"/>
                <span>Series A</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="Series B" name="group2"/>
                <span>Series B</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="Series C +" name="group2"/>
                <span>Series C +</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="Public" name="group2"/>
                <span>Public</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="Option 6" name="group2"/>
                <span>Option 6</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="Other" name="group2"/>
                <span>Other</span></label>
            </div>
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRadio1}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Radio Modal Component for average_project_size */}
      <Modal show={showRadio2} onHide={handleCloseRadio2}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <fieldset id="group3" className="radio-container">
            <label>Average Project Size?</label>
            <div>
                <label className="radio-label"><input type="radio" value="1000+" name="group3"/>
                <span>1000+</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="5000+" name="group3"/>
                <span>5000+</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="10000+" name="group3"/>
                <span>10000+</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="25000+" name="group3"/>
                <span>25000+</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="50000+" name="group3"/>
                <span>50000+</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="Other" name="group3"/>
                <span>Other</span></label>
            </div>
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRadio2}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Radio Modal Component for multiple yes_or_no_sections */}
      <Modal show={showRadio3} onHide={handleCloseRadio3}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <fieldset id="group4" className="radio-container1">
            <label>{modalTitle}</label>
            <div>
                <label className="radio-label"><input type="radio" value="Yes" name="group4"/>
                <span>Yes</span></label>
            </div>
            <div>
                <label className="radio-label"><input type="radio" value="No" name="group4"/>
                <span>No</span></label>
            </div>
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRadio3}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Partner Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul style={{listStyleType:"none",textAlign:"left"}}>
            <img
              className="img-thumbnail img-fluid img-responsive"
              src={data.imageURL} //props.hit.imageURL
              alt={props.hit.objectID}
              width="200px"
              align="right"
              height="200px"
              onClick={handleShow31}
              style={{cursor:"pointer"}}
            />
            {/* {openUpdate && 
            <button className="img__update" onClick={handleShow31}>Image Update</button>} */}
            <li className="line">
              <b>Category : </b>{data.category}{openUpdate &&
              <button className="update__button" onClick={handleShow0}>Update</button>}
            </li>
            <li className="line">
              <b>Partner Name : </b>{data.name}{openUpdate && 
              <button className="update__button" onClick={handleShow}>Update</button>}
            </li>
            <li className="line">
              <b>Phone Number : </b>{data.phone}{openUpdate && 
              <button className="update__button" onClick={handleShow1}>Update</button>}
            </li>
            <li className="line">
              <b>Address : </b>{data.address}{openUpdate && 
              <button className="update__button" onClick={handleShow2}>Update</button>}
            </li>
            <li className="line">
              <b>Partner Contact Name : </b>{data.contact_name}{openUpdate && 
              <button className="update__button" onClick={handleShow3}>Update</button>}
            </li>
            <li className="line">
              <b>Partner Contact Email : </b>{data.contact_email}{openUpdate && 
              <button className="update__button" onClick={handleShow4}>Update</button>}
            </li>
            <li className="line">
              <b>Partner Contact Title : </b>{data.contact_title}{openUpdate && 
              <button className="update__button" onClick={handleShow5}>Update</button>}
            </li>
            <li className="line">
              <b>Website : </b>{data.website}{openUpdate && 
              <button className="update__button" onClick={handleShow6}>Update</button>}
            </li>
            <li className="line">
              <b>Linkedin : </b>{data.linkedin}{openUpdate && 
              <button className="update__button" onClick={handleShow7}>Update</button>}
            </li>
            <li className="line">
              <b>Twitter : </b>{data.twitter}{openUpdate && 
              <button className="update__button" onClick={handleShow8}>Update</button>}
            </li>
            <li className="line">
              <b>Partner Size : </b>{data.size}{openUpdate && 
              <button className="update__button" onClick={handleShow9}>Update</button>}
            </li>
            <li className="line">
              <b>Venture Funding : </b>{data.venture_funding}{openUpdate && 
              <button className="update__button" onClick={handleShow10}>Update</button>}
            </li>
            {/* <li className="line">
              <b>Data Founded : </b>{data.date_founded}
            </li> */}
            {/* <li className="line">
              <b>Data Created : </b>{data.data_created}
            </li>
            <li className="line">
              <b>Data Updated : </b>{data.data_updated}
            </li> */}
            <li className="line">
              <b>Average Project Size : </b>{global.average_size}{openUpdate && 
              <button className="update__button" onClick={handleShow14}>Update</button>}
            </li>
            <li className="line">
              <b>Certified : </b>{global.certified}{openUpdate && 
              <button className="update__button" onClick={handleShow12}>Update</button>}
            </li>
            <li className="line">
              <b>Client Focus : </b>
              {typeof(global.client_focus) === "string" | typeof(global.client_focus) === 'undefined' ? 
              global.client_focus : global.client_focus.join(", ")}
              {openUpdate && <button className="update__button" onClick={handleShow13}>Update</button>}
            </li>
            <li className="line">
              <b>Data Readiness : </b>
              {typeof(global.data_readiness) === "string" | typeof(global.data_readiness) === 'undefined' ? 
              global.data_readiness : global.data_readiness.join(", ")}
              {openUpdate && <button className="update__button" onClick={handleShow15}>Update</button>}
            </li>
            <li className="line">
              <b>Global Locations : </b>{global.locations}{openUpdate && 
              <button className="update__button" onClick={handleShow16}>Update</button>}
            </li>
            <li className="line">
              <b>Industry Focus : </b>
              {typeof(global.industry_focus) === "string" | typeof(global.industry_focus) === 'undefined' ? 
              global.industry_focus : global.industry_focus.join(", ")}
              {openUpdate && <button className="update__button" onClick={handleShow25}>Update</button>}
            </li>
            <li className="line">
              <b>Master Services Agreement : </b>{global.master_services}{openUpdate && 
              <button className="update__button" onClick={handleShow17}>Update</button>}
            </li>
            <li className="line">
              <b>Non-Disclousure Agreement : </b>{global.nondisclosure}{openUpdate && 
              <button className="update__button" onClick={handleShow18}>Update</button>}
            </li>
            <li className="line">
              <b>Pricing Model : </b>{global.price}{openUpdate && 
              <button className="update__button" onClick={handleShow19}>Update</button>}
            </li>
            <li className="line">
              <b>Rating : </b>{global.rating}{openUpdate && 
              <button className="update__button" onClick={handleShow30}>Update</button>}
            </li>
            <li className="line">
              <b>Resources Available : </b>
              {typeof(global.resources) === "string" | typeof(global.resources) === 'undefined' ? 
              global.resources : global.resources.join(", ")}
              {openUpdate && <button className="update__button" onClick={handleShow22}>Update</button>}
            </li>
            <li className="line">
              <b>Reviews Description : </b>{global.reviews_desc}{openUpdate && 
              <button className="update__button" onClick={handleShow23}>Update</button>}
            </li>
            <li className="line">
              <b>Service Technology : </b>
              {typeof(global.service_tech) === "string" | typeof(global.service_tech) === 'undefined' ? 
              global.service_tech : global.service_tech.join(", ")}
              {openUpdate && <button className="update__button" onClick={handleShow11}>Update</button>}
            </li>
            <li className="line">
              <b>Testimonial Description : </b>{global.testimonial_desc}{openUpdate && 
              <button className="update__button" onClick={handleShow24}>Update</button>}
            </li>
            <li className="line">
              <b>Reseller Agreement : </b>{global.reseller}{openUpdate &&
              <button className="update__button" onClick={handleShow26}>Update</button>}
            </li>
            <li className="line">
              <b>Use Case Epic : </b>{usecase.epic}{openUpdate && 
              <button className="update__button" onClick={handleShow20}>Update</button>}
            </li>
            <li className="line">
              <b>Use Case Description : </b>{usecase.description}{openUpdate && 
              <button className="update__button" onClick={handleShow21}>Update</button>}
            </li>
          </ul>
          {!openUpdate ?
          <Button variant="primary" style={{float:"right"}} onClick={() => setOpenUpdate(true)}>Update Process</Button>
          :
          <Button variant="primary" style={{float:"right"}} onClick={() => setOpenUpdate(false)}>Close Update</Button>
          }
        </Modal.Body>
      </Modal>

      {/* Checkbox Modal Component for client_focus */}
      <Modal show={showCheckbox} onHide={handleCloseCheckbox}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="checkbox-container1">
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCheckbox}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Checkbox Modal Component for data_readiness */}
      <Modal show={showCheckbox1} onHide={handleCloseCheckbox1}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="checkbox-container1">
            <label>What is the Client Data Readiness Required?</label>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCheckbox1}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Checkbox Modal Component for industry_focus */}
      <Modal show={showCheckbox2} onHide={handleCloseCheckbox2}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="checkbox-container1">
          <label>Please select Industry Focus?</label>
          <div className="checkbox-box">
              <div>
                  <label className="checkbox-label">
                  <input type="checkbox"/><span>Retail</span></label>
              </div>
              <div>
                  <label className="checkbox-label">
                  <input type="checkbox"/><span>Consumer Packaged Goods</span></label>
              </div>
              <div>
                  <label className="checkbox-label">
                  <input type="checkbox"/><span>Healthcare</span></label>
              </div>
              <div>
                  <label className="checkbox-label">
                  <input type="checkbox"/><span>Information Technology</span></label>
              </div>
              <div>
                  <label className="checkbox-label">
                  <input type="checkbox"/><span>Professional and Business Services</span></label>
              </div>
              <div>
                  <label className="checkbox-label">
                  <input type="checkbox"/><span>Finance and Insurance</span></label>
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
                  <input type="checkbox"/><span>Manufacturing</span></label>
              </div>
          </div>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCheckbox2}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Checkbox Modal Component for resources_available */}
      <Modal show={showCheckbox4} onHide={handleCloseCheckbox4}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="checkbox-container1">
            <label>What are your Resources Available? </label>
            <div className="checkbox-box">
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Junior Data Scientist</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Data Scientist</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Senior Data Scientist</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/>
                    <span>Junior Software Engineer [Front-end / Back-end]</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/>
                    <span>Software Engineer [Front-end / Back-end]</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/>
                    <span>Senior Software Engineer [Front-end / Back-end]</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>DevOps Engineer</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Senior DevOps Engineer</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Technical Leader</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Analyst / ETL</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Project Manager</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Other</span></label>
                </div>
            </div>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCheckbox4}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Checkbox Modal Component for service_technology */}
      <Modal show={showCheckbox3} onHide={handleCloseCheckbox3}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="checkbox-container1">
            <label>What are your AI Service Technologies? </label>
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
                    <input type="checkbox"/><span>Virtual Agents / Chatbots</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>IoT / AI Optimized Hardware</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Natural Language Processing (NLP)</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Speech Recognition</span></label>
                </div>
                <div>
                    <label className="checkbox-label">
                    <input type="checkbox"/><span>Computer Vision / Image Recognition</span></label>
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
                    <input type="checkbox"/><span>Robotic Process Automation (RPA)</span></label>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCheckbox3}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Checkbox Modal Component for rating */}
      <Modal show={showRating} onHide={handleCloseRating}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <label>
          <span>Rating (between 1 and 5): </span><input type="number" name="quantity" min="1" max="5"/>
        </label>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRating}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* This modal for category */}
      <Modal show={showDrop} onHide={handleCloseDrop}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Select Category : 
        <select id = "dropdown" value={currentValue} onChange={handleChange}>
             {/* <option value="N/A">N/A</option> */}
             <option value="AIaas">AIaas</option>
             <option value="MLaaS">MLaaS</option>
             <option value="DevOps">DevOps</option>
             <option value="Talent Augmentation">Talent Augmentation</option>
        </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDrop}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
    )
}

Hit.propTypes = {
    hit: PropTypes.object.isRequired
};