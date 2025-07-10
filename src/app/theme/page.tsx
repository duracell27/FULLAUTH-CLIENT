import { Card, CardContent, CardHeader, CardTitle, ToggleTheme } from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Site theme'
}

type Props = {}

const ThemePage = (props: Props) => {
  return (
    <div className='flex flex-col gap-3 justify-center items-center h-screen max-w-[400px]'>
        <BackButton  />
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Site theme</CardTitle>
            </CardHeader>
            <CardContent>
                <ToggleTheme />
            </CardContent>
        </Card>
    </div>
  )
}

export default ThemePage