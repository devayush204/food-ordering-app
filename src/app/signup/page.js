"use client"
import axios from 'axios';
import { signIn } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingUser, setCreatingUser] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [error, setError] = useState(false);

    async function handleFormSubmit(e) {
        e.preventDefault();
        setCreatingUser(true);
        setError(false);
        const response = await axios.post('/api/signup', { email, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok){
            userCreated(true)
        } else  {
            setError(true);
        }
        setCreatingUser(false);
        




    }


    return (
        <section className='mt-8'>
            <h1 className='text-center text-4xl text-primary mb-4'>
                Signup
            </h1>
            {userCreated && (
                <div className='my-4 text-center'>
                    User Created. <br /> Now you can
                    <Link className='ml-2 underline hover:text-primary' href={'/login'}>Login &raquo;</Link>
                </div>
            )}
            {error && (
                <div className='my-4 text-center'>
                    Error. <br />
                    Pls try again.
                </div>
            )}
            <form className='block max-w-xs mx-auto' onSubmit={handleFormSubmit}>
                <input type="email" placeholder='email' value={email} onChange={e => setEmail(e.target.value)} disabled={creatingUser} />
                <input type="password" placeholder='password' value={password} onChange={e => setPassword(e.target.value)} disabled={creatingUser} />
                <button type='submit' disabled={creatingUser}>Signup</button>
                <div className='my-4 text-center text-gray-500'>or sinup with provider</div>
                <button onClick={()=> signIn('google', {callbackUrl: "/"})}>
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