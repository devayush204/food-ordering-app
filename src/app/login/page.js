"use client"
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import {signIn} from "next-auth/react"
import { redirect } from 'next/dist/server/api-utils';

const page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false)

    async function handleFormSubmit(e) {
        e.preventDefault();
        setLoginInProgress(true);
       
        await signIn('credentials', {email, password, callbackUrl:"/"});

        setLoginInProgress(false);        
        
    }
    return (
        <section className='mt-8'>
            <h1 className='text-center text-4xl text-primary mb-4'>
                Login
            </h1>

            <form className='block max-w-xs mx-auto ' onSubmit={handleFormSubmit}>
                <input name='email' type="email" placeholder='email' value={email} onChange={e => setEmail(e.target.value)} disabled={loginInProgress} />
                <input name='password' type="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)} disabled={loginInProgress} />
                <button disabled={loginInProgress} type='submit'>Login</button>
                <div className='my-4 text-center text-gray-500'>or login with provider</div>
                <button type='button' className='flex gap-4 justify-center ' 
                onClick={()=> signIn('google', {callbackUrl: "/"})}
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