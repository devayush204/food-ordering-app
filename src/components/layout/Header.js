"use client"
import Link from 'next/link'
import React from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Auth } from '@/models/fireBase_connect'
import Image from 'next/image'

const Header = () => {
  const [user] = useAuthState(Auth)
  const router = useRouter()

  const logOut = async () => {
    await signOut(Auth)
    router.push("/")
  }



  return (
    <header className="flex items-center justify-between ">

      <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        <Link className="text-primary font-semibold text-2xl" href={"/"}>Snacks Here</Link>
        <Link href={'/'}>Home</Link>
        <Link href={''}>Menu</Link>
        <Link href={''}>About</Link>
        <Link href={''}>Contact Us</Link>
      </nav>

      <nav className='flex items-center gap-6 text-gray-500 font-semibold'>
        {user ?
          <>
            <div className='flex gap-1 items-center justify-center'>
              <Image width={35} height={35} className="rounded-full" src={user.photoURL} alt="pfp" />
              <Link className='whitespace-nowrap' href={'/profile'}> {user.displayName}</Link>
            </div>
            <button
              onClick={logOut}
              className='bg-primary rounded-full text-white px-5 py-2'>Logout</button>

          </> :
          <>
            <Link href={'/login'}>Login</Link>
            <Link className="bg-primary rounded-2xl text-white px-8 py-2" href={'/signup'}>Signup</Link>
          </>
        }

      </nav>
    </header>
  )
}

export default Header