import React from 'react'
import BookingPage from './_components/BookingPage'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
 
async function page() {
    const loingin =  await  auth()
    if (!loingin) {
     redirect('/login')
    }
  return (
    <div>
        <BookingPage />
    </div>
  )
}

export default page