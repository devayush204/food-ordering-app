import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import { FirebaseProvider } from '@/models/fireBase_connect'
import { CartProvider } from '@/components/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'order your food here',
  description: 'developed by ayush',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className='max-w-4xl mx-auto px-4 py-3'>
          <CartProvider>
            <FirebaseProvider>
              <Header />
              {children}
            </FirebaseProvider>
          </CartProvider>
        </main>
      </body>
    </html>
  )
}
