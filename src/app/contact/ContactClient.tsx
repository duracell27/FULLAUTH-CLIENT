'use client'

import { useTranslationsHome } from '@/shared/hooks/useTranslationsHome'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/componets/ui/Card'
import { Button } from '@/shared/componets/ui/Button'
import { Mail, MessageCircle } from 'lucide-react'

export default function ContactClient() {
  const { t } = useTranslationsHome()

  return (
    <div className="w-full mx-auto pt-18 mb-18 max-w-[400px]">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle>{t('contact')}</CardTitle>
            <CardDescription>
              {t('contactDescription')}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Email Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t('email')}
            </CardTitle>
            <CardDescription>
              {t('emailDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('mailto:volodymyrshmidt@gmail.com', '_blank')}
            >
              volodymyrshmidt@gmail.com
            </Button>
          </CardContent>
        </Card>

        {/* Telegram Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t('support')}
            </CardTitle>
            <CardDescription>
              {t('supportDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('https://t.me/volodymyr_shmidt', '_blank')}
            >
              {t('telegramSupport')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
