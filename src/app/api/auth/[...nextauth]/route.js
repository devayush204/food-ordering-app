import { User } from "@/models/User";
import mongoose from "mongoose";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcrypt"
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";


export const authOptions = {
  secret: process.env.SECRET,
  // adapter: MongoDBAdapter(clientPromise),   this creating error so for now commented out
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
        CredentialsProvider({
            name: 'Credentials',
            id: "credentials",
            credentials: {
              username: { label: "Email", type: "email", placeholder: "any@gmail.com" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
            const email = credentials?.email;
            const password = credentials?.password;  
            

            
              mongoose.connect(process.env.MONGO_URL);
              const user = await User.findOne({email});
              const passwordOk = user && bcrypt.compareSync(password, user.password)

              

              if (passwordOk) {
                return user;
              }

              return null
            }
          })
    ],
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}