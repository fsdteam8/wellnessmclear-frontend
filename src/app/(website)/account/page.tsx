import AccountPage from '@/app/(website)/account/_components/AccountPage'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'

async function page() {
    const loingin =  await  auth()
    if (!loingin) {
     redirect('/login')
    }
  return (
    <div>
       <AccountPage />
    </div>
  )
}

export default page