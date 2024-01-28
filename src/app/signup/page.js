"use client"
import axios from 'axios';
import { Auth } from '@/models/fireBase_connect';
import { Provider } from '@/models/fireBase_connect';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';


const page = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // function for signin with email and password
    const signInPassword = async()=>{
        try {
            await createUserWithEmailAndPassword(Auth, email, password )
        } catch (err) {
            console.error(err)
        }

    }

// signing with Provider(google)
    const signInProvider=async(e)=> {
        try {
            await signInWithPopup(Auth, Provider);
            console.log("Login successful");
            router.push('/');
          } catch (err) {
            console.error(err);
          }
    }
   

    


    return (
        <section className='mt-8'>
            <h1 className='text-center text-4xl text-primary mb-4'>
                Signup
            </h1>
           
            <form className='block max-w-xs mx-auto' >
                <input type="email" placeholder='email'  onChange={e => setEmail(e.target.value)}  />
                <input type="password" placeholder='password'  onChange={e => setPassword(e.target.value)} />
                <button onClick={signInPassword} >Signup</button>
                <div className='my-4 text-center text-gray-500'>or sinup with provider</div>
                <button onClick={signInProvider}>
                    <Image src={'/google.png'} alt={''} width={24} height={24} />
                    Signup with Google
                </button>

                <div className='text-center my-4 text-gray-500 border-t pt-4'>
                    Existing account?
                    <Link className='underline hover:text-primary ml-2' href={'/login'}>Login here</Link>
                </div>
            </form>


        </section>
    )
}

export default page