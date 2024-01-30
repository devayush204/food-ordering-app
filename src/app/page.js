"use client"
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { Auth } from "@/models/fireBase_connect";
import { useAuthState } from "react-firebase-hooks/auth";



export default function Home() {

  // displaying user details 
  // const [user] = useAuthState(Auth);
  // console.log(user)


  return (
    <>
      <Hero />
      <HomeMenu />

      <section className="text-center my-16">
        <SectionHeaders subHeader={'Our Story'} mainHeader={'About Us'}/>
        <div className="text-gray-500 max-w-2xl mx-auto mt-4 flex flex-col gap-4">
        <p className=" ">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt recusandae excepturi, accusamus at unde repellendus tempora harum, placeat natus nihil, voluptatem reiciendis sapiente fugiat mollitia debitis? Animi facere aliquam explicabo!</p>
        <p className=" ">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt recusandae excepturi, accusamus at unde repellendus tempora harum, placeat natus nihil, voluptatem reiciendis sapiente fugiat mollitia debitis? Animi facere aliquam explicabo!</p>
        </div>
      </section>

      <section className="text-center">
        <SectionHeaders subHeader={'order here again'} mainHeader={'Contact Us'} />
        <a href="tel:+9170561984874">+917056284757</a>
      </section>
    </>

  )
}
