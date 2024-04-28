"use client"
import Right from '@/components/icons/Right'
import UserTabs from '@/components/layout/UserTabs'
import { Auth, db } from '@/models/fireBase_connect'
import { collection, getDocs } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'


const MenuItems = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user] = useAuthState(Auth);

    useEffect(() => {
        if (user) {
            fetchMenuItems();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchMenuItems = async () => {
        try {
            // Fetch menu items for the authenticated user
            const userId = user.uid;
            const menuItemsCollectionRef = collection(db, 'users', userId, 'menuItems');
            const menuItemsSnapshot = await getDocs(menuItemsCollectionRef);
            const menuItemsData = menuItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMenuItems(menuItemsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching menu items:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <section className='mt-10'>
            <UserTabs isAdmin={false} />

            <div className='flex  items-center justify-center'>
                <Link className='flex gap-3 mt-10 bg-red-500 px-5 text-center py-2 rounded-lg font-semibold text-white' href={"/menu-items/new"}>
                    Create new Menu-Items
                <Right/>
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
                {menuItems.map((menuItem) => (
                    <div key={menuItem.id} className="bg-gray-200 p-4 rounded-md">
                        <Image className='object-contain' src={menuItem.imageUrl} width={500} height={500} alt={menuItem.itemName} />
                        <div className="mt-2">
                            <h3 className="capitalize text-lg font-semibold">{menuItem.itemName}</h3>
                            <p className="text-gray-600 capitalize">{menuItem.description}</p>
                            <p className="text-gray-600">{menuItem.basePrice}</p>
                        </div>
                    </div>
                ))}
            </div>


        </section>
    )
}

export default MenuItems