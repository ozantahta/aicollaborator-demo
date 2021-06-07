/* eslint-disable jsx-a11y/alt-text */
import React,{useContext} from "react";
import {Link, Redirect} from "react-router-dom";
import logo from "../images/AIC_logo.png";
import {AuthContext} from "../context/Auth"
import "../css/style.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import {firebase} from "../firebase"

export default function Nav(){
    const navStyle = {
        color:"white",
        textDecoration:"none"
    }

    const { currentUser, emailAddress, setEmailAddress } = useContext(AuthContext)
    
    function handleSignOut(){
        firebase.auth().signOut();
        setEmailAddress("")
    }
    
    return(
        <nav className="main">
            <Link style={navStyle} to="/"><img src={logo} height="50"/></Link>
            <ul className="navo-links">
                <Link style={{color:"white",textDecoration:"none"}} to="/partner">Partners</Link>
                <Link style={navStyle} to="/client">Clients</Link>
                {emailAddress === "admin" ? 
                <DropdownButton 
                    key="Secondary" 
                    id="dropdown-variants-Secondary" 
                    variant="secondary"
                    title={currentUser ? "myaccount" : "Log In"}
                >
                    <Dropdown.Item eventKey="1">
                        <Link to="/login" style={{color:"black"}}>{currentUser ? "myaccount" : "Log In"}</Link>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">
                        <Link to="/adminpartner" style={{color:"black"}}>Admin Partner</Link>
                    </Dropdown.Item>   
                    <Dropdown.Item eventKey="3">
                        <Link to="/adminclient" style={{color:"black"}}>Admin Client</Link>
                    </Dropdown.Item> 
                    <Dropdown.Item eventKey="4">
                        <button 
                            style={{border:"none",backgroundColor:"white"}} 
                            onClick={handleSignOut}
                        >
                        Sign Out
                        </button>
                    </Dropdown.Item>
                </DropdownButton>
                :
                emailAddress === "partner" || emailAddress === "client" ? 
                <DropdownButton 
                    key="Secondary" 
                    id="dropdown-variants-Secondary" 
                    variant="secondary"
                    title={currentUser ? "myaccount" : "Log In"}
                >
                    <Dropdown.Item eventKey="1">
                        <Link to="/login" style={{color:"black"}}>{currentUser ? "myaccount" : "Log In"}</Link>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">
                        <button
                            align="left" 
                            style={{border:"none",backgroundColor:"white"}} 
                            onClick={handleSignOut}
                        >
                        Sign Out
                        </button>
                    </Dropdown.Item>
                </DropdownButton>
                :
                <Link to="/login" style={navStyle}>{currentUser ? "myaccount" : "Log In"}</Link>
                }
            </ul>
        </nav>
    )   
}
//https://pbs.twimg.com/profile_images/1282753010263678976/xHh5KEIV_400x400.jpg