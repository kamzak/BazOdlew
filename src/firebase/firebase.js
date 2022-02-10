import firebase from "firebase/compat/app";
import "firebase/compat/storage";

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0_wLEm0kTPqpecoGo0nIxW-rpV-Xt_xU",
  authDomain: "bazodlew.firebaseapp.com",
  projectId: "bazodlew",
  storageBucket: "bazodlew.appspot.com",
  messagingSenderId: "935744604931",
  appId: "1:935744604931:web:d144f49ff664198d77f736",
  measurementId: "G-4XHB6GSEVK",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export  {
    storage, firebase as default
  }
 
