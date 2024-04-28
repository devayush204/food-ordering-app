// import Image from 'next/image';
// import React from 'react';

// const MenuItem = ({ imageUrl, itemName, description, price }) => {
//     return (
//         <div className='bg-gray-200 p-4 rounded-lg text-center hover:bg-white hover:shadow-black/75 hover:shadow-md transition-all'>
//             <div className='text-center'>
//                 <Image className='object-contain' width={200} height={200} src={imageUrl} alt={name} />
//             </div>
//             <h4 className='font-semibold text-xl my-3'>{itemName}</h4>
//             <p className='text-gray-500 text-sm'>{description}</p>
//             <button className='mt-4 bg-primary text-white rounded-full px-6 py-2'>
//                 Add to cart Rs.{price}
//             </button>
//         </div>
//     );
// }

// export default MenuItem;

import React from 'react';
import { useCart } from '../CartContext';

const MenuItem = ({ id, name, description, price }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        const item = { id, name, description, price };
        addToCart(item);
    };

    return (
        <div className='bg-gray-200 p-4 rounded-lg text-center hover:bg-white hover:shadow-black/75 hover:shadow-md transition-all'>
            <div className='text-center'>
            <img className='max-h-24 block mx-auto' src="/pizza.png" alt="pizza" />
            </div>
            <h4 className='font-semibold text-xl my-3'>Pepperoni Pizza</h4>
            <p className='text-gray-500 text-sm'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            <button className='mt-4 bg-primary text-white rounded-full px-6 py-2'>
                Add to cart Rs.199
            </button>
        </div>
    );
};

export default MenuItem;
