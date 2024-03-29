// Import the functions you need from the SDKs you need
"use client"
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
import { createContext } from "react";


const firebaseConfig = {
  apiKey: "AIzaSyCsXVIYXUTgFen3eFQvxWm1uH9YZAnJnEw",
  authDomain: "food-ordering-409518.firebaseapp.com",
  projectId: "food-ordering-409518",
  storageBucket: "food-ordering-409518.appspot.com",
  messagingSenderId: "393752623606",
  appId: "1:393752623606:web:0d5a999edb0c67dcf4efd7",
  measurementId: "G-N7E3C5DPKC"
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