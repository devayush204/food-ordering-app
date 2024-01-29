"use client"
import React from 'react'
import { Auth } from '@/models/fireBase_connect'
import { useAuthState } from 'react-firebase-hooks/auth'
import Image from 'next/image'

const page = () => {
    const [user] = useAuthState(Auth);


  return (
    <section className='mt-8'>
    <h1 className='text-center text-4xl text-primary mb-4 font-bold'>
        profile
    </h1>

    <div className='max-w-md mx-auto mt-8'>
        {/* {profileSaved && (
            <h2 className='text-center rounded-xl font-bold border bg-green-100 my-2 p-4'>Profile changed!</h2>
        )}
        {isSaving && (
            <h2 className='text-center rounded-xl font-bold border bg-blue-100 my-2 p-4'>Saving Changes</h2>

        )} */}
        <div className='flex gap-6 items-center'>
            <div className='bg-zinc-200 px-5 py-2 rounded-xl gap-1 flex flex-col'>
                <div>
                    <Image className='rounded-full' src={user?.photoURL} width={110} height={110} />
                </div>

                <label className='text-center' >
                    <input type="file" className='hidden' />
                    <span className='text-black text-center bg-white px-4 py-1 rounded-xl'>Edit</span>
                </label>
                {/* <button type='button' className='bg-white py-1 '>Edit</button> */}
            </div>
            <form className='w-full'>
                <input type="text" placeholder='Your full name here'
                    value={user?.displayName}  />
                <input type="email" disabled={true} value={user?.email} />
                <button type='submit'>Save</button>
            </form>
        </div>
    </div>
</section>  )
}

export default page