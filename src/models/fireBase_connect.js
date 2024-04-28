// Import the functions you need from the SDKs you need
"use client"
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import { createContext } from "react";


const firebaseConfig = {
  apiKey: "AIzaSyB9L4rKnJkVnhxH37jtWkQg3ZUpr70hpKo",
  authDomain: "food-delivery-c2529.firebaseapp.com",
  projectId: "food-delivery-c2529",
  storageBucket: "food-delivery-c2529.appspot.com",
  messagingSenderId: "908402711215",
  appId: "1:908402711215:web:61be89fc00d4303440125a",
  measurementId: "G-V5JLW5LJDG"
};


const FirebaseContext = createContext(null);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Auth = getAuth(app)
const Provider = new GoogleAuthProvider()
const db = getFirestore(app)
const storage = getStorage(app)



export const FirebaseProvider = (props) =>{
  return <FirebaseContext.Provider>{props.children}</FirebaseContext.Provider>
}


export {Auth, Provider, db, storage};