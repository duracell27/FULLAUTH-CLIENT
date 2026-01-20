'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/shared/componets/ui/Card'
import { Button } from '@/shared/componets/ui/Button'
import { X, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useTranslationsHome } from '@/shared/hooks/useTranslationsHome'

const BANNER_STORAGE_KEY = 'guide-banner-dismissed'

export function GuideBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslationsHome()

  useEffect(() => {
    // Перевіряємо чи банер був закритий раніше
    const isDismissed = localStorage.getItem(BANNER_STORAGE_KEY)
    if (!isDismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(BANNER_STORAGE_KEY, 'true')
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <Card className="w-full max-w-[400px] border-primary/50 bg-primary/5">
      <CardContent className="pt-4 pb-4 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-1 right-1 h-6 w-6 p-0"
          onClick={handleDismiss}
        >
          <X className="h-3 w-3" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-1.5">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-xs mb-1">
              {t('guideBannerTitle')}
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              {t('guideBannerDescription')}
            </p>
            <Link href="/guide">
              <Button size="sm" className="h-7 text-xs">
                {t('viewGuide')}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
