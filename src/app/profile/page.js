// "use client"
// import axios from 'axios';
// import { useSession } from 'next-auth/react'
// import Image from 'next/image';
// import { redirect } from 'next/navigation';
// import React, { useEffect, useState } from 'react'

// const page = () => {
//     // const session = useSession();
//     // const [userName, setUserName] = useState('');
//     // const [profileSaved, setProfileSaved] = useState(false);
//     // const [isSaving, setIsSaving] = useState(false);
//     // // console.log(session);
//     // console.log(userName);
//     // const { status } = session;

//     // useEffect(() => {
//     //     if (status === 'authenticated') {
//     //         setUserName(session.data.user.name);
//     //     }
//     // }, [session, status]);

//     // async function handleProfileInfoUpdate(e) {
//     //     e.preventDefault()
//     //     setIsSaving(true);
//     //     setProfileSaved(true);
//     //     const response = await axios.put('api/profile', { name: userName }, {
//     //         headers: {
//     //             'Content-Type': 'application/json',
//     //         },
//     //     })
//     //     setIsSaving(false)
//     //     if (response.ok) {
//     //         setProfileSaved(true);
//     //     }
//     // }

//     // if (status === 'loading') {
//     //     return 'Loading...';
//     // }

//     // if (status === 'unauthenticated') {
//     //     return redirect("/login");
//     // }

//     const userImage = session.data.user.image;


//     return (
//         <section className='mt-8'>
//             <h1 className='text-center text-4xl text-primary mb-4 font-bold'>
//                 profile
//             </h1>

//             <div className='max-w-md mx-auto mt-8'>
//                 {profileSaved && (
//                     <h2 className='text-center rounded-xl font-bold border bg-green-100 my-2 p-4'>Profile changed!</h2>
//                 )}
//                 {isSaving && (
//                     <h2 className='text-center rounded-xl font-bold border bg-blue-100 my-2 p-4'>Saving Changes</h2>

//                 )}
//                 <div className='flex gap-6 items-center'>
//                     <div className='bg-zinc-200 px-5 py-2 rounded-xl gap-1 flex flex-col'>
//                         <div>
//                             <Image className='rounded-full' src={userImage} width={110} height={110} />
//                         </div>

//                         <label className='text-center' >
//                             <input type="file" className='hidden' />
//                             <span className='text-black text-center bg-white px-4 py-1 rounded-xl'>Edit</span>
//                         </label>
//                         {/* <button type='button' className='bg-white py-1 '>Edit</button> */}
//                     </div>
//                     <form onSubmit={handleProfileInfoUpdate} className='w-full'>
//                         <input type="text" placeholder='Your full name here'
//                             value={userName} onChange={e => setUserName(e.target.value)} />
//                         <input type="email" disabled={true} value={session.data.user.email} />
//                         <button type='submit'>Save</button>
//                     </form>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default page