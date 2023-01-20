import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as firebase from "firebase/app"; 
import "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
    apiKey: "AIzaSyBCi3IED9zVtUNCCQ5Yx7KAf1MO5Bgyn5Q",
    authDomain: "crypto-racers.firebaseapp.com",
    projectId: "crypto-racers",
    storageBucket: "crypto-racers.appspot.com",
    messagingSenderId: "872433329672",
    appId: "1:872433329672:web:6c84ce41728a90547293bd",
    measurementId: "G-NV2581PQ8Q"
};

const app = initializeApp(firebaseConfig);
 
export const auth = getAuth(app);
export const firestore = getFirestore(app);