"use client"
import React, { useEffect, useState } from 'react'
import { Auth, db, storage } from '@/models/fireBase_connect'
import { useAuthState } from 'react-firebase-hooks/auth'
import Image from 'next/image'
import Link from 'next/link'
import { updateProfile } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const page = () => {

    //states used in the page
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
    const [isAdmin , setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(false);


    //handler functions
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
    

    //cheching if user's a admin or not
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            if (user) {
              const userDocRef = doc(db, 'users', Auth.currentUser.uid);
              const userDocSnapshot = await getDoc(userDocRef);
              console.log(userDocSnapshot)
    
              if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                
                // Check if the user has admin privileges
                const userIsAdmin = userData?.admin || false;
                
                setIsAdmin(userIsAdmin);
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUserData();
      }, [user]); 

    //handle to save delivery address
    const handleSaveAddressChanges = async (e) => {
        e.preventDefault();

        try {
            // Update user data in Firestore
            const userDocRef = doc(db, 'users', Auth.currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                // Reference to the deliveryAddress subcollection
                const deliveryAddressCollectionRef = collection(userDocRef, 'deliveryAddress');

                // Create or update the document data in the address collection
                await setDoc(deliveryAddressCollectionRef, { ...deliveryAddress });
                console.log('Delivery address changes saved in Firestore');
            }

            setIsEditing(false);
        } catch (err) {
            console.error('Error saving delivery address to Firestore:', err.message);
            console.log('Current deliveryAddress:', deliveryAddress);
        }
    };


    //user can change photo
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `profile_photos/${Auth.currentUser.uid}/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file);

            try {
                // Wait for the upload to complete and get the download URL
                const snapshot = await uploadTask;
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Set the new photoURL state
                setNewPhotoURL(downloadURL);

                // Optionally, update the photoURL in Firestore
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
            // Update user data in Firestore
            const userDocRef = doc(db, 'users', Auth.currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                await setDoc(userDocRef, {
                    userId: Auth.currentUser.uid,
                    userEmail: Auth.currentUser.email,
                    username: newUsername,
                    photoURL: newPhotoURL || user?.photoURL || null,
                });
                console.log('Profile changes saved in Firestore');
            }

            // Update user profile in Firebase Authentication
            await updateProfile(Auth.currentUser, { displayName: newUsername, photoURL: newPhotoURL });
            console.log('Profile changes saved in Firebase Authentication');
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

    // Check if the user is authenticated
    if (!user) {
        // Redirect or show a login page, or handle the scenario where the user is not logged in
        return (<div className='text-center mt-20'>
            <p>Your are not signed in...</p>
            <Link href={"/signup"} className='px-4 py-1.5 bg-red-600 text-[14px] text-white font-semibold'>Sign in</Link>
        </div>)
    }


    return (
        <section className='mt-8'>
            <div className='inline-flex mx-auto gap-2 tabs'>
                <Link className={'active'} href={'/profile'}>Profile</Link>
                {isAdmin && (
                    <>
                        <Link href={'/categories'}>Categories</Link>
                        <Link href={'/menu-items'}>Menu Items</Link>
                        <Link href={'/users'}>Users</Link>
                    </>
                )}
            </div>

            <div className='max-w-md mx-auto mt-8'>

                <div className='flex gap-6 items-center'>
                    <div className='bg-zinc-200 px-5 py-2 rounded-xl gap-3 flex flex-col '>
                        <div>
                            {/* <Image className='rounded-full' src={user?.photoURL} width={110} height={110} /> */}
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
        </section>)
}

export default page