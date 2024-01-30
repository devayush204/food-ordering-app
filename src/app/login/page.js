"use client"
// import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth'
import { Auth, db } from '@/models/fireBase_connect';
import { Provider } from '@/models/fireBase_connect';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

const page = () => {
    const router = useRouter()
    const [user] = useAuthState(Auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false)


 // Function to check user credentials in Firestore
 const checkUserCredentials = async (email, password) => {
    const usersCollectionRef = collection(db, 'users');
    const querySnapshot = await getDocs(query(usersCollectionRef, where('userEmail', '==', email)));

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Verify the password (you may need to implement your own logic for this)
        if (userData.userPassword === password) {
            return true; // Credentials are valid
        }
    }

    return false; // Credentials are invalid
};

// Signing in with email and password
const signInPassword = async (e) => {
    e.preventDefault();

    try {
        setLoginInProgress(true);

        // Check user credentials in Firestore
        const isValidCredentials = await checkUserCredentials(email, password);

        if (isValidCredentials) {
            // If credentials are valid, sign in with Firebase Auth
            await signInWithEmailAndPassword(Auth, email, password);
            router.push('/');
            console.log('Signed in successfully');
        } else {
            console.log('Invalid credentials');
            // Handle invalid credentials (show an error message, etc.)
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoginInProgress(false);
    }
};





//    siging in with Provider(google)
    const signInProvider=async(e)=> {
        e.preventDefault();
        try {
            await signInWithPopup(Auth, Provider);
            console.log("Login successful");
            router.push('/');
          } catch (err) {
            console.error(err);
            console.log("faiked")
          }
    }
    return (
        <section className='mt-8'>
            <h1 className='text-center text-4xl text-primary mb-4'>
                Login
            </h1>

            <form className='block max-w-xs mx-auto ' >
                <input name='email' type="email" placeholder='email' value={email} onChange={e => setEmail(e.target.value)} disabled={loginInProgress} />
                <input name='password' type="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)} disabled={loginInProgress} />
                <button disabled={loginInProgress} onClick={signInPassword}  type='submit'>Login</button>
                <div className='my-4 text-center text-gray-500'>or login with provider</div>
                <button type='button' className='flex gap-4 justify-center ' 
                onClick={signInProvider}
                 >
                    <Image src={'/google.png'} alt={''} width={24} height={24} />
                    Login with Google
                </button>

                <div className='text-center my-4 text-gray-500 border-t pt-4'>
                    Dont have acount!😂
                    <Link className='underline hover:text-primary ml-2' href={'/signup'}>Signup here</Link>
                </div>
            </form>
        </section>
    )
}

export default page