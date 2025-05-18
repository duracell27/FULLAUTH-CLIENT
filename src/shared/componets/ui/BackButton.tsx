'use client'
import React from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'


type Props = {}

export const BackButton = (props: Props) => {
    const router = useRouter()
  return (
    <div className='self-start '><Button className='cursor-pointer' variant={'outline'} onClick={() => router.back()}><ArrowLeft /></Button></div>
  )
}