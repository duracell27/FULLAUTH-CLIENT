'use client'

import { Card, CardContent, CardHeader, CardTitle, ToggleTheme } from '@/shared/componets/ui'
import { BackButton } from '@/shared/componets/ui/BackButton'
import React from 'react'
import { useTranslations } from '@/shared/hooks'

type Props = {}

export const ThemePageClient = (props: Props) => {
  const { t } = useTranslations()
  
  return (
    <div className='flex flex-col gap-3 justify-center items-center h-screen max-w-[400px]'>
        <BackButton  />
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>{t('siteTheme')}</CardTitle>
            </CardHeader>
            <CardContent>
                <ToggleTheme />
            </CardContent>
        </Card>
    </div>
  )
}
