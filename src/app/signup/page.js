"use client"
import { Auth, Provider, db } from '@/models/fireBase_connect';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); 

    // Function to add user data to Firestore
    const addUserDataToFirestore = async (userId, userEmail, userPassword, username, photoURL, isAdmin) => {
        const usersCollectionRef = collection(db, 'users');

        // Use the user's UID as the document ID
        const userDocRef = doc(usersCollectionRef, userId);

        try {
            // Add user data to Firestore
            await setDoc(userDocRef, {
                userId,
                userEmail,
                userPassword,
                username,
                photoURL,
                isAdmin, // Include isAdmin field in Firestore document
            });

            console.log("User data added to Firestore");
        } catch (error) {
            console.error("Error adding user data to Firestore:", error);
        }
    };

    // useEffect to handle onAuthStateChanged event
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            if (user) {
                const username = user.email ? user.email.split('@')[0] : '';

                // If user signs up with Google, additional information may be available
                if (user.providerData && user.providerData[0]?.providerId === 'google.com') {
                    const { displayName, photoURL } = user.providerData[0];

                    // Store user data in Firestore
                    addUserDataToFirestore(user.uid, user.email, password, displayName || username, photoURL, isAdmin);
                } else {
                    // Store user data in Firestore for email/password signup
                    addUserDataToFirestore(user.uid, user.email, password, username, null, isAdmin);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // function for signup with email and password
    const signUpWithEmailPassword = async (e) => {
        e.preventDefault();

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(Auth, email, password);

            // The onAuthStateChanged event will handle adding user data to Firestore
            router.push('/');
            console.log("Signed up successfully");
        } catch (err) {
            console.error(err);
        }
    };

    // function to handle checkbox change
    const handleCheckboxChange = (e) => {
        setIsAdmin(e.target.checked); // Update isAdmin state based on checkbox value
    };

    // signing with Provider(google)
    const signUpWithGoogle = async (e) => {
        e.preventDefault();

        try {
            // Sign up with Google provider
            await signInWithPopup(Auth, Provider);

            // The onAuthStateChanged event will handle adding user data to Firestore
            router.push('/');
            console.log("Sign up with Google successful");
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <section className='mt-8'>
            <h1 className='text-center text-4xl text-primary mb-4'>
                Signup
            </h1>

            <form className='block max-w-xs mx-auto' >
                <input type="email" placeholder='email' onChange={e => setEmail(e.target.value)} value={email} />
                <input type="password" placeholder='password' onChange={e => setPassword(e.target.value)} value={password} />
                 
                <label className='flex flow-row items-center py-2 gap-2'>
                    <input type="checkbox" onChange={handleCheckboxChange} checked={isAdmin} />
                    <p>Are you a admin?</p>
                </label>
                
                <button type='submit' onClick={signUpWithEmailPassword}>Signup</button>
                <div className='my-4 text-center text-gray-500'>or signup with provider</div>
                <button onClick={signUpWithGoogle}>
                    <Image src={'/google.png'} alt={''} width={24} height={24} />
                    Signup with Google
                </button>

                <div className='text-center my-4 text-gray-500 border-t pt-4'>
                    Existing account?
                    <Link className='underline hover:text-primary ml-2' href={'/login'}>Login here</Link>
                </div>
            </form>
        </section>
    );
};

export default Page;
