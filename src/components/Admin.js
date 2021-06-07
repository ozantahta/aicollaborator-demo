/* eslint-disable react-hooks/rules-of-hooks */
import React,{useRef,useState,useContext, useEffect} from 'react'
import {Card, Form, Button, Alert} from "react-bootstrap"
import {withRouter,Redirect} from "react-router-dom";
import db, {firebase} from "../firebase"
import {AuthContext} from "../context/Auth"

function Admin({history}) {
    const [error,setError] = useState("")
    const [show,setShow] = useState(false)

    function sleep(){
        setTimeout(function(){setShow(false);},5000)
    }
   

    async function handleAdmin(event){
        var actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp:true
        }
        event.preventDefault();
        const {email} = event.target.elements;
        
        await db.collection("admin").get().then((snapshot)=> {
            snapshot.forEach((doc) => {
                if (doc.data().admin_email === email.value){
                    console.log("Admin matched")
                    try {
                        firebase.auth()
                            .sendSignInLinkToEmail(email.value, actionCodeSettings);
                        window.localStorage.setItem("emailForSignIn",email.value);
                        history.push("/activate")
                    } catch(error){
                        setError(error)
                    }
                }else{
                    setShow(true)
                    sleep()
                }
            })
        })
    }

    const {currentUser} = useContext(AuthContext)

    if (currentUser){
        return <Redirect to="/myaccount"/>
    }
    return (
        <div style={{minHeight:"60vh"}} className="d-flex align-items-center justify-content-center">
            <Card className="w-100" style={{maxWidth:"400px"}}>
                <Card.Body>
                    <h2  className="text-center mb-4">Admin Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleAdmin}>
                        <Form.Group>
                            <Form.Label>Email </Form.Label>
                            <Form.Control type="email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required/>
                            {show && <Alert variant="danger" style={{marginTop:"20px"}}>You can't login because you are not Admin</Alert>}
                        </Form.Group>
                        <Button type="submit" className="w-100" >Login</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )
}

export default withRouter(Admin)