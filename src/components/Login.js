/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-sequences */
import React,{useContext,useCallback,useState} from "react";
import {withRouter, Redirect, useLocation} from "react-router-dom";
import db,{firebase} from "../firebase";
import {AuthContext} from "../context/Auth";
import {Card, Form, Button, Alert} from "react-bootstrap"

const Login = ({history}) => {
    let location = useLocation()
    const [show,setShow] = useState(false)
    //console.log(window.location.href)

    function sleep(){
        setTimeout(function(){setShow(false);},5000)
    }

    // function sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }

    const handleLogin = useCallback(
        
        async event => {
            //Added
            var actionCodeSettings = {
                url: window.location.origin + location.pathname, 
                handleCodeInApp:true
            };
            
            
            event.preventDefault()
            const {email} = event.target.elements;

            await ["partner","client"].map((collection) =>
                    db.collection(collection).get().then((snapshot) => {
                        snapshot.forEach((doc) => {
                            if (doc.data().partner_contact_email === email.value){
                                console.log("Partner is matched",email.value, "User: ",collection)
                                try {
                                    firebase
                                        .auth()
                                        .sendSignInLinkToEmail(email.value,actionCodeSettings);
                                    window.localStorage.setItem("emailForSignIn", email.value);
                                    history.push("/activate");
                                } catch(error) {
                                    alert(error)
                                }
                            }else if (doc.data().client_contact_email === email.value){
                                try {
                                    firebase
                                        .auth()
                                        .sendSignInLinkToEmail(email.value,actionCodeSettings);
                                    window.localStorage.setItem("emailForSignIn", email.value);
                                    history.push("/activate");
                                } catch(error) {
                                    alert(error)
                                }
                            }
                            else{
                                setShow(true);
                                sleep()
                            }
                        })
                    })
                )
            // sleep(2000);
            // setShow(false);
            // try {
            //     firebase
            //         .auth()
            //         .sendSignInLinkToEmail(email.value,actionCodeSettings);
            //     window.localStorage.setItem("emailForSignIn", email.value);
            //     history.push("/activate");
            // } catch(error) {
            //     alert(error)
            // }
        },
        [history]
    );
    

    const { currentUser } = useContext(AuthContext)

    if (currentUser){
        return <Redirect to="/myaccount"/>
    }

    
    return (
        <div >
            <div style={{minHeight:"70vh"}} className="d-flex align-items-center justify-content-center">
            <Card className="w-100" style={{maxWidth:"400px"}}>
                <Card.Body>
                    <h2  className="text-center mb-4">Login</h2>
                    
                    <Form onSubmit={handleLogin}>
                        <Form.Group>
                            <Form.Label>Email </Form.Label>
                            <Form.Control type="email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required/>
                            {show && <Alert variant="danger" style={{marginTop:"20px",textAlign:"center"}}>Please Sign Up</Alert>}
                        </Form.Group>
                        <Button type="submit" className="w-100">Login</Button>
                    </Form>
                    {/* {show && <Alert variant="danger" style={{marginTop:"20px",textAlign:"center"}}>Please Sign Up</Alert>} */}
                </Card.Body>
            </Card>
        </div>
            {/* <h1 style={{textAlign:"center"}}>Login</h1>
            
            <form onSubmit={handleLogin} style={{textAlign:"center",margin:"20px 20px"}}>
                <label>
                    Email
                    <input name="email" type="email" placeholder="Email"/>
                    <button type="submit">Log In</button>
                </label>
            </form>
            {show && <Alert variant="danger" style={{margin:"10px 550px 10px",textAlign:"center"}}>Please Sign Up</Alert>} */}
        </div>
    )
}

export default withRouter(Login)