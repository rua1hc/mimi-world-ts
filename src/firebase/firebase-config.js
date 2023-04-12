import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: "mimitauhai.firebaseapp.com",
    projectId: "mimitauhai",
    storageBucket: "mimitauhai.appspot.com",
    messagingSenderId: "91378995923",
    appId: "1:91378995923:web:1f38992a33ff8802093a26",
    measurementId: "G-XJP5HQ9KM1",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAnalytics = getAnalytics(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { firebaseAuth, firestore };
