import React from 'react'

const MenuItem = () => {
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
    )
}

export default MenuItem