"use client"
// import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { useAuthState } from "react-firebase-hooks/auth"
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Auth } from '@/models/fireBase_connect'

const Header = () => {
  const [user] = useAuthState(Auth)
  const router = useRouter()

  const logOut = async() =>{
    await signOut(Auth)
    router.push("/")
}

  // const session = useSession();
  // console.log(session)
  // const status = session?.status;
  // const userData = session.data?.user;
  // let userName = userData?.name || userData?.email;
  // if(userName && userName.includes(' ')) {
  //   userName = userName.split(' ')[0];
  // }

  return (
    <header className="flex items-center justify-between">

      <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        <Link className="text-primary font-semibold text-2xl" href={"/"}>Snacks Here</Link>
        <Link href={'/'}>Home</Link>
        <Link href={''}>Menu</Link>
        <Link href={''}>About</Link>
        <Link href={''}>Contact Us</Link>
      </nav>

      <nav className='flex items-center gap-4 text-gray-500 font-semibold'>
        {user ?
          <>
            <Link className='whitespace-nowrap' href={'/profile'}>Hello! {user.displayName}</Link>
            <button
              onClick={logOut}
              className='bg-primary rounded-full text-white px-8 py-2'>Logout</button>

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