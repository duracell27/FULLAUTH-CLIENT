'use client'

import { useTranslationsHome } from '@/shared/hooks/useTranslationsHome'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/componets/ui/Card'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'

interface GuideStep {
  titleKey: string
  descriptionKey: string
  images: string[]
}

export default function GuideClient() {
  const { t, currentLanguage, isLoading } = useTranslationsHome()

  // Визначаємо локаль для шляху до зображень (для всіх мов крім uk буде en)
  const imageLocale = currentLanguage === 'UK' ? 'uk' : 'en'

  // Масив кроків з відповідними зображеннями
  const guideSteps: GuideStep[] = [
    {
      titleKey: 'guideStep1Title',
      descriptionKey: 'guideStep1Description',
      images: ['Add group.png']
    },
    {
      titleKey: 'guideStep2Title',
      descriptionKey: 'guideStep2Description',
      images: ['Add members.png', 'Add members 1.png']
    },
    {
      titleKey: 'guideStep3Title',
      descriptionKey: 'guideStep3Description',
      images: ['Create expense.png']
    },
    {
      titleKey: 'guideStep4Title',
      descriptionKey: 'guideStep4Description',
      images: ['Expense 1.png']
    },
    {
      titleKey: 'guideStep5Title',
      descriptionKey: 'guideStep5Description',
      images: ['Expense 2.png']
    },
    {
      titleKey: 'guideStep6Title',
      descriptionKey: 'guideStep6Description',
      images: ['Balances.png']
    },
    {
      titleKey: 'guideStep7Title',
      descriptionKey: 'guideStep7Description',
      images: ['Pay balance.png']
    },
    {
      titleKey: 'guideStep8Title',
      descriptionKey: 'guideStep8Description',
      images: ['Payments.png']
    },
    {
      titleKey: 'guideStep9Title',
      descriptionKey: 'guideStep9Description',
      images: ['Summary.png']
    },
    {
      titleKey: 'guideStep10Title',
      descriptionKey: 'guideStep10Description',
      images: ['Personal groups.png']
    },
    {
      titleKey: 'guideStep11Title',
      descriptionKey: 'guideStep11Description',
      images: ['Add friend.png', 'Search friend.png']
    }
  ]

  if (isLoading) {
    return (
      <div className="w-full mx-auto pt-18 mb-18 max-w-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">{t('loading')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 justify-start items-center py-18">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t('guide')}
            </CardTitle>
            <CardDescription>
              {t('guideDescription')}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Guide Steps */}
        {guideSteps.map((step, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">
                {t(step.titleKey)}
              </CardTitle>
              <CardDescription>
                {t(step.descriptionKey)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {step.images.map((imageName, imgIndex) => (
                  <div key={imgIndex} className="relative w-full rounded-lg overflow-hidden border">
                    <Image
                      src={`/images/guide/${imageLocale}/${imageName}`}
                      alt={t(step.titleKey)}
                      width={800}
                      height={600}
                      className="w-full h-auto"
                      priority={index < 3}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
