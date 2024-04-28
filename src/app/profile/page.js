"use client"
import React, { useEffect, useState } from 'react'
import { Auth, db, storage } from '@/models/fireBase_connect'
import { useAuthState } from 'react-firebase-hooks/auth'
import Image from 'next/image'
import Link from 'next/link'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Router from 'next/router'
import { usePathname, useRouter } from 'next/navigation'
import UserTabs from '@/components/layout/UserTabs'

const Page = () => {
    const [user, loading, error] = useAuthState(Auth);
    const [newUsername, setNewUsername] = useState(user?.email.split('@')[0] || '');
    const [newPhotoURL, setNewPhotoURL] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState({
        phone: '',
        street: '',
        zipCode: '',
        city: '',
        country: '',
    });
    const [originalDeliveryAddress, setOriginalDeliveryAddress] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    // Add authentication state change listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (authUser) => {
            if (authUser) {
                // User is signed in
                console.log('User is signed in:', authUser);
            } else {
                // User is signed out
                console.log('User is signed out');
            }
        });

        return () => {
            // Unsubscribe from the listener when the component unmounts
            unsubscribe();
        };
    }, []);

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


    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    };

    const handlePhotoURLChange = (e) => {
        setNewPhotoURL(e.target.value);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setOriginalDeliveryAddress({ ...deliveryAddress })
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
        setDeliveryAddress({ ...originalDeliveryAddress });
    };

    const handleSaveAddressChanges = async (e) => {
        e.preventDefault();
        try {
            const userDocRef = doc(db, 'users', Auth.currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const deliveryAddressCollectionRef = collection(userDocRef, 'deliveryAddress');
                // Create a copy of the delivery address before updating it
                const updatedDeliveryAddress = { ...deliveryAddress };
                await setDoc(deliveryAddressCollectionRef, updatedDeliveryAddress);
            }

            setIsEditing(false);
        } catch (err) {
            console.error('Error saving delivery address to Firestore:', err.message);
            console.log('Current deliveryAddress:', deliveryAddress);
        }
    };


    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profile_photos/${Auth.currentUser.uid}/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file);

            try {
                const snapshot = await uploadTask;
                const downloadURL = await getDownloadURL(snapshot.ref);
                setNewPhotoURL(downloadURL);

                const userDocRef = doc(db, 'users', Auth.currentUser.uid);
                await setDoc(userDocRef, {
                    photoURL: downloadURL,
                });

                console.log('File uploaded successfully:', downloadURL);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const userDocRef = doc(db, 'users', Auth.currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                await setDoc(userDocRef, {
                    userId: Auth.currentUser.uid,
                    userEmail: Auth.currentUser.email,
                    username: newUsername,
                    photoURL: newPhotoURL || user?.photoURL || null,
                });
            }

            await updateProfile(Auth.currentUser, { displayName: newUsername, photoURL: newPhotoURL });
            console.log('Profile changes saved in Firestore');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        console.error('Authentication error:', error);
        return <p>Error while loading user data. Please try again later.</p>;
    }

    if (!user) {
        return (
            <div className='text-center mt-20'>
                <p>Your are not signed in...</p>
                <Link href={"/signup"} className='px-4 py-1.5 bg-red-600 text-[14px] text-white font-semibold'>Sign in</Link>
            </div>
        );
    }

    return (
        <section className='mt-8'>
            <UserTabs/>


            <div className='max-w-md mx-auto mt-8'>
                <div className='flex gap-6 items-center'>
                    <div className='bg-zinc-200 px-5 py-2 rounded-xl gap-3 flex flex-col '>
                        <div>
                            <img src={newPhotoURL || user?.photoURL} className='rounded-full w-[140px] h-[90px]' alt="" />
                        </div>

                        <label className='text-center' >
                            <input type="file" className='hidden' onChange={handleFileUpload} />
                            <span className='text-black text-center bg-white px-4 py-1 rounded-xl'>Edit</span>
                        </label>
                    </div>
                    <form className='w-full'>
                        <label >Full Name</label>
                        <input type="text" placeholder='Your full name here'
                            value={user?.displayName} onChange={handleUsernameChange} />

                        <label>Email</label>
                        <input type="email" disabled={true} value={user?.email} />

                        <button type='submit' onClick={handleSaveChanges}>Save</button>
                    </form>
                </div>
                <form className='mt-10' >
                    <div className='flex justify-between items-center'>
                        <p className=' text-2xl text-primary mb-2 font-bold'>
                            Delivery Address
                        </p>
                        <span className='flex '>
                            {!isEditing && (
                                <span className='cursor-pointer flex' onClick={handleEdit}>
                                    <svg className='w-[17px] fill-black ' viewBox="0 0 24 24" ><path d="M16.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l10-10 3-3zM14 7.414l-9 9V19h2.586l9-9L14 7.414zm4 1.172L19.586 7 17 4.414 15.414 6 18 8.586z" /></svg>
                                    <p className='text- '>Edit</p>
                                </span>
                            )}

                        </span>
                        {isEditing && (
                            <span className='cursor-pointer' onClick={handleCancelEdit}>
                                <p>Cancel</p>
                            </span>
                        )}
                    </div>
                    <label>Phone No.</label>
                    <input type='tel'
                        placeholder='Phone no.'
                        value={deliveryAddress.phone}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                        disabled={!isEditing} />

                    <label>Street Address</label>
                    <input type='text'
                        placeholder='Street address'
                        value={deliveryAddress.street}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                        disabled={!isEditing} />
                    <div className='flex gap-4'>
                        <div className='flex flex-col'>
                            <label>Zip code</label>
                            <input type="text"
                                placeholder='Zip Code'
                                value={deliveryAddress.zipCode}
                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                                disabled={!isEditing} />
                        </div>
                        <div className='flex flex-col'>
                            <label>City</label>
                            <input type="text"
                                placeholder='City'
                                value={deliveryAddress.city}
                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                disabled={!isEditing} />
                        </div>
                    </div>
                    <label>Country</label>
                    <input type="text"
                        placeholder='Country'
                        value={deliveryAddress.country}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, country: e.target.value })}
                        disabled={!isEditing} />
                    <div className='flex justify-end items-center gap-4'>
                        {isEditing && (
                            <button type='submit' className='w-[50%]' onClick={handleSaveAddressChanges}>Save</button>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Page;
