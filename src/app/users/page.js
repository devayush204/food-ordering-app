"use client"
import UserTabs from '@/components/layout/UserTabs'
import { db } from '@/models/fireBase_connect';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

const UsersPage = () => {
    const [adminUsers, setAdminUsers] = useState([]);

    useEffect(() => {
        fetchAdminUsers();
    }, []);


    const fetchAdminUsers = async () => {
        try {
            // Query the users collection to get only users where isAdmin is true
            const usersCollectionRef = collection(db, 'users');
            const q = query(usersCollectionRef, where('isAdmin', '==', true));
            const querySnapshot = await getDocs(q);

            // Extract user data from the query snapshot
            const adminUsersData = [];
            querySnapshot.forEach((doc) => {
                adminUsersData.push(doc.data());
            });

            // Update state with fetched admin users
            setAdminUsers(adminUsersData);
        } catch (error) {
            console.error('Error fetching admin users:', error);
        }
    };
    return (
        <div className='mt-10 flex flex-col gap-5' >
            <UserTabs isAdmin={true} />
            <div className='py-5 px-20'>
                <ul className='flex flex-col gap-2 '>
                    {adminUsers.map((user) => (
                        <li className='flex justify-between items-center bg-zinc-200 py-2 text-lg px-5 rounded-lg ' key={user.id}>
                            <p className='text-gray-600'>{user.username ? user.username : user.userEmail.split('@')[0]}</p>
                            <p className='text-gray-600'>{user.userEmail}</p>
                            <a className='text-sm border-[1px] border-black/10 px-5 py-1 rounded-lg' href='/users/userform'>Edit</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default UsersPage