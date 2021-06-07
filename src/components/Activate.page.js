import React, { useContext } from "react";
import {Alert} from "react-bootstrap";
import { Redirect } from "react-router";
import { AuthContext } from "../context/Auth";

export const ActivatePage = props => {

  const { currentUser } = useContext(AuthContext)

  if (currentUser){
    return <Redirect to="/"/>
  }
  
  return (
      <Alert variant="success" style={{margin:"20px 50px 20px"}}>
        <Alert.Heading>Check your inbox</Alert.Heading>
        <p>
          We sent you an activation link. Please be sure to check your spam folder too.
        </p>
      </Alert>
  );
};
