import Firebase from 'firebase';

const firebaseApp = Firebase.initializeApp({
    apiKey: "AIzaSyBLFwcwAOflouMWnBPAQDN3lClFDS_gY10",
    authDomain: "instagram-clone-b0cf4.firebaseapp.com",
    projectId: "instagram-clone-b0cf4",
    storageBucket: "instagram-clone-b0cf4.appspot.com",
    messagingSenderId: "271992105580",
    appId: "1:271992105580:web:71c52c93f15f0cb96e4649",
    measurementId: "G-P236FDZVFT"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export {db, auth, storage};
