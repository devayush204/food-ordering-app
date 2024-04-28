// CartPage.js
"use client"
import React, { useState } from 'react';
import img1 from "../../../public/pizza.png"
import img2 from "../../../public/pizza2.png"
import img3 from "../../../public/pizza.png"
import Image from 'next/image';
import Trash from '@/components/icons/Trash';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Item 1', price: 10, quantity: 1, imageUrl: img1 },
        { id: 2, name: 'Item 2', price: 15, quantity: 2, imageUrl: img2 },
        { id: 3, name: 'Item 3', price: 20, quantity: 1, imageUrl: img3 }
    ]);

    const handleRemoveFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    const handleIncreaseQuantity = (itemId) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedItems);
    };

    const handleDecreaseQuantity = (itemId) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === itemId && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setCartItems(updatedItems);
    };

    const getTotalSum = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <>
            <h2 className='text-center  text-red-500 text-5xl my-5 font-bold'>Cart Items</h2>
            <section className='flex gap-10'>
                <div className='mt-10 w-[60%]'>
                    <div className="my-5 flex flex-col gap-3 ">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-[1px] px-10 border-black/30  rounded-lg">
                                <Image width={100} height={100} src={item.imageUrl} alt={item.name} className="cart-item-image" />
                                <div className='flex flex-col'>
                                    <p>Name: {item.name}</p>
                                    <p>Price: ${item.price}</p>
                                </div>
                                <div className='flex gap-2 justify-center items-center text-sm'>
                                    <span className='bg-red-500 text-white px-2 py-1 rounded-full text-center' onClick={() => handleIncreaseQuantity(item.id)}>+</span>
                                    <p>Quantity: {item.quantity}</p>
                                    <span className='bg-red-500 text-white px-2 py-1 rounded-full text-center' onClick={() => handleDecreaseQuantity(item.id)}>-</span>
                                </div>
                                <span onClick={() => handleRemoveFromCart(item.id)}>
                                    <Trash />
                                </span>
                            </div>
                        ))}
                        <div className="flex  justify-end  ">
                            <div className='bg-red-500 text-white px-5 gap-3 py-2 flex rounded-lg'>
                                <p>Total:</p>
                                <p>${getTotalSum()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-[40%] '>
                    <form className='mt-14 px-5 py-7  rounded-xl bg-gray-200' >

                        <div className='flex justify-between items-center'>
                            <p className=' text-2xl text-primary mb-2 font-bold'>
                                Delivery Address
                            </p>
                            <span className='flex '>
                                {/* {!isEditing && (
                                <span className='cursor-pointer flex' onClick={handleEdit}>
                                    <svg className='w-[17px] fill-black ' viewBox="0 0 24 24" ><path d="M16.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l10-10 3-3zM14 7.414l-9 9V19h2.586l9-9L14 7.414zm4 1.172L19.586 7 17 4.414 15.414 6 18 8.586z" /></svg>
                                    <p className='text- '>Edit</p>
                                    </span>
                                )} */}

                            </span>
                            {/* {isEditing && (
                            <span className='cursor-pointer' onClick={handleCancelEdit}>
                                <p>Cancel</p>
                            </span>
                        )} */}
                        </div>
                        <label>Phone No.</label>
                        <input type='tel'
                            placeholder='Phone no.' />

                        <label>Street Address</label>
                        <input type='text'
                            placeholder='Street address' />
                        <div className='flex gap-4'>
                            <div className='flex flex-col'>
                                <label>Zip code</label>
                                <input type="text"
                                    placeholder='Zip Code' />
                            </div>
                            <div className='flex flex-col'>
                                <label>City</label>
                                <input type="text"
                                    placeholder='City' />
                            </div>
                        </div>
                        <label>Country</label>
                        <input type="text"
                            placeholder='Country'
                        />
                        {/* <div className='flex justify-end items-center gap-4'>
                        {isEditing && (
                            <button type='submit' className='w-[50%]' onClick={handleSaveAddressChanges}>Save</button>
                        )}
                    </div> */}
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => alert('Checkout clicked')}>Pay ${getTotalSum()}</button>

                    </form>
                </div>
            </section>
        </>
    );
};

export default CartPage;
