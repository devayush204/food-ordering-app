"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import MenuItem from '../menu/MenuItem'
import SectionHeaders from './SectionHeaders'
import { Auth, db } from '@/models/fireBase_connect'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, getDocs, query } from 'firebase/firestore'

const HomeMenu  = () => {
    const [user] = useAuthState(Auth);
    const [menuItems, setMenuItems] = useState([]);


    useEffect(() => {
        const fetchMenuItems = async () => {
            if (!user) return; // If user is not authenticated, return

            try {
                const q = query(collection(db, 'users', user.uid, 'menuItems'));
                const querySnapshot = await getDocs(q);

                const items = [];
                querySnapshot.forEach((doc) => {
                    items.push({ id: doc.id, ...doc.data() });
                });

                setMenuItems(items);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, [user]); 
    return (
        <section className=''>
            <div className="absolute left-0 right-0 w-full justify-start">
                <div className="absolute left-0 -top-[70px] text-left -z-10">
                    <Image src={'/sallad1.png'} width={109} height={189} alt={'sallad'} />
                </div>
                <div className="absolute -top-[100px] right-0 -z-10">
                    <Image src={'/sallad2.png'} width={107} height={195} alt={'sallad'} />
                </div>
            </div>
            <div className='text-center space-y-5 my-5'>
                <SectionHeaders subHeader={'Check Out'} mainHeader={"Menu"} />
            </div>

            <div className='grid grid-cols-3 gap-4 my-5'>
                {menuItems.map((item) => (
                    <MenuItem key={item.id} {...item} />
                ))}
            </div>

        </section>
    )
}

export default HomeMenu