import firebase from "firebase";

const app = firebase.initializeApp({
    apiKey: "AIzaSyB2N6sdfsdf5SDF6dggfsdg9SDF658FTpGDPQ",
    authDomain: "firestore-12we11.firebaseapp.com",
    projectId: "firestore-12we11",
    storageBucket: "firestore-12we11.appspot.com",
    messagingSenderId: "1055972556691",
    appId: "1:1123597564:web:8we16wf84eg84e561e489",
    measurementId: "G-5W8WE48EE48"
});
// Initialize Firebase

const db = app.firestore();

export default db;
export {firebase,app};

