"use client"
import Left from '@/components/icons/Left';
import { Auth, db } from '@/models/fireBase_connect';
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const NewMenuItemsPage = () => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [extraCosts, setExtraCosts] = useState([{ size: '', extraCost: '' }]);

    // Function to handle changes in extra costs inputs
    const handleExtraCostChange = (index, field, value) => {
        const newExtraCosts = [...extraCosts];
        newExtraCosts[index][field] = value;
        setExtraCosts(newExtraCosts);
    };

    // Function to add new extra cost input fields
    const addExtraCostField = () => {
        setExtraCosts([...extraCosts, { size: '', extraCost: '' }]);
    };

    // Function to remove extra cost input fields
    const removeExtraCostField = (index) => {
        const newExtraCosts = [...extraCosts];
        newExtraCosts.splice(index, 1);
        setExtraCosts(newExtraCosts);
    };


    //function to upload img
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        const storage = getStorage();
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Progress monitoring if needed
            },
            (error) => {
                console.error('Error uploading image:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                });
            }
        );
    };

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        try {
            // Get the authenticated user
            const currentUser = Auth.currentUser;
            if (!currentUser) {
                // Handle case where user is not authenticated
                console.error('User is not authenticated');
                return;
            }

            // Add menu item to Firestore under the authenticated user's document
            const userId = currentUser.uid; // Get the user ID
            const userDocRef = doc(db, 'users', userId);
            const menuItemsCollectionRef = collection(userDocRef, 'menuItems');
            const extraCostsData = extraCosts.map(({ size, extraCost }) => ({ size, extraCost }));

            await addDoc(menuItemsCollectionRef, {
                itemName,
                description,
                basePrice,
                imageUrl,
                extraCosts: extraCostsData
            });

            // Reset form fields
            setItemName('');
            setDescription('');
            setBasePrice('');
            setImage(null);
            setImageUrl('');
            setImagePreview(null);
            setExtraCosts([{ size: '', extraCost: '' }]);

            // Show success message
            toast.success('Menu item added successfully');
            console.log('Menu item added successfully');
        } catch (error) {
            console.error('Error adding menu item:', error);
            alert('Error adding menu item. Please try again.');
        }
    };
    return (

        <div className='mt-10'>
            <div className='flex items-center justify-center'>
                <Link className='flex gap-3 capitalize mt-10 bg-red-500 px-5 text-center py-2 rounded-lg font-semibold text-white' href={"/menu-items"}>
                    <Left />
                    Go back to menu-items

                </Link>
            </div>
            <form className='flex flex-col justify-center items-center mt-5 px-16 gap-3' onSubmit={handleItemSubmit}>
                {imagePreview && (
                    <div className=''>
                        <Image className='object-cover' src={imagePreview} width={200} height={200} alt='img' />
                    </div>
                )}
                <div className='w-[60%]'>
                    <label>Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div className='w-[60%]'>
                    <label>Item Name</label>
                    <input className='outline-none px-5 input ' type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                </div>
                <div className='w-[60%]'>
                    <label>Description</label>
                    <input className='input' type='text' value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className='w-[60%]'>
                    <label>Base Price</label>
                    <input className='input' type="text" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                </div>
                <div className='w-[60%] px-5 py-3 bg-zinc-200 '>
                    <p className='text-sm text-gray-500'>Extra charges</p>
                    <div className='flex flex-col gap-2 justify-center '>

                        {extraCosts.map((extraCost, index) => (
                            <div key={index} className='w-[60%] flex gap-2 items-center justify-between'>
                                <div>
                                    <input className='text-sm px-2 py-1.5 rounded-lg w-[100px] '
                                        type='text'
                                        placeholder='Size'
                                        value={extraCost.size}
                                        onChange={(e) => handleExtraCostChange(index, 'size', e.target.value)}
                                    />
                                </div>
                                <div>

                                    <input
                                        className='text-sm px-2 py-1.5 rounded-lg w-[100px] '
                                        type='text'
                                        placeholder='Extra cost'
                                        value={extraCost.extraCost}
                                        onChange={(e) => handleExtraCostChange(index, 'extraCost', e.target.value)}
                                    />
                                </div>
                                <div className='flex gap-3'>
                                    {index === extraCosts.length - 1 && (
                                        <button className='bg-red-500 text-white px-3 py-1 rounded-md' onClick={addExtraCostField}>+</button>
                                    )}
                                    {index == 0 && (
                                        <button className='bg-red-500 text-white px-3 py-1 rounded-md' onClick={() => removeExtraCostField(index)}>-</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className='w-[60%] text-white bg-red-500 py-2 rounded-lg ' type="submit">Add Item</button>
            </form>
        </div>
    )
}

export default NewMenuItemsPage