"use client"
import { Auth, db } from '@/models/fireBase_connect';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';

const UserTabs = () => {
    const [user, loading, error] = useAuthState(Auth);
    const [isAdmin, setIsAdmin] = useState(false);
    const pathname = usePathname();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user) {
                    const userDocRef = doc(db, 'users', Auth.currentUser.uid);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        const isAdmin = userData.isAdmin || false;
                        // console.log('isAdmin:', isAdmin);
                        setIsAdmin(isAdmin);
                    } else {
                        console.log('No such document!');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user]);

    if (!user) {
        return (
            <div className='text-center mt-20'>
                <p>Your are not signed in...</p>
                <Link href={"/signup"} className='px-4 py-1.5 bg-red-600 text-[14px] text-white font-semibold'>Sign in</Link>
            </div>
        );
    }

    return (
        <section>
            <div className='inline-flex mx-auto gap-2 tabs'>
                <Link className={`${pathname === "/profile" ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"} rounded-full py-2 px-4`} href='/profile'>Profile</Link>
                {isAdmin && (
                    <>
                        <Link className={`${pathname === "/categories" ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"} rounded-full py-2 px-4`} href='/categories'>Categories</Link>
                        <Link className={`${pathname === "/menu-items" ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"} rounded-full py-2 px-4`} href='/menu-items'>Menu Items</Link>
                        <Link className={`${pathname === "/users" ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"} rounded-full py-2 px-4`} href='/users'>Users</Link>
                    </>
                )}
            </div>

        </section>
    )
}

export default UserTabs