/* eslint-disable no-sequences */
/* eslint-disable array-callback-return */
import React,{useState,useEffect} from 'react'
import db, {firebase} from "../firebase"


export const AuthContext = React.createContext()

export default function AuthProvider({children}) {
    const [currentUser,setCurrentUser] = useState(null)
    

    useEffect(() => {
        var email = window.localStorage.getItem('emailForSignIn')
        if (firebase.auth().isSignInWithEmailLink(window.location.href)){
            if (!email){
                email = window.prompt('Please provide your email for confirmation')
            }
            firebase.auth().signInWithEmailLink(email,window.location.href)
                .then(function(result){
                    window.localStorage.removeItem('emailForSignIn');
                })
                .catch(function(error){
                    alert(error)
                });
        }

        firebase.auth().onAuthStateChanged(setCurrentUser)
    },[]);

    const [emailAddress, setEmailAddress] = useState("")

    useEffect(() => {
        if (currentUser){
            //Check the admin email
            db.collection("admin").get().then(snapshot => {
                snapshot.forEach(doc => {
                    if (doc.data().admin_email === currentUser.email){
                        setEmailAddress("admin")
                    }
                })
            })

            //Check the partner email
            db.collection("partner").get().then(snapshot => {
                snapshot.forEach(doc => {
                    if (doc.data().partner_contact_email === currentUser.email){
                        setEmailAddress("partner")
                    }
                })
            })

            
            //Check the client email
            db.collection("client").get().then(snapshot => {
                snapshot.forEach(doc => {
                    if (doc.data().client_contact_email === currentUser.email){
                        setEmailAddress("client")
                    }
                })
            })
        }

    }, [currentUser])
    
    
    return (
        <AuthContext.Provider
            value={{
                currentUser,
                emailAddress,
                setEmailAddress
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
