'use client'

import { useTranslationsHome } from '@/shared/hooks/useTranslationsHome'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/shared/componets/ui/Card'

export default function VersionClient() {
	const { t } = useTranslationsHome()

	return (
		<div className='w-full pt-18 mb-18 max-w-[400px]'>
			<div className='space-y-6'>

				{/* Changelog */}
				<Card>
					<CardHeader>
						<CardTitle>{t('changelog')}</CardTitle>
						<CardDescription>
							{t('changelogDescription')}
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='font-medium'>v0.3.5</span>
								<span className='text-sm text-muted-foreground'>
									2026-01-20
								</span>
							</div>
							<div className='text-sm text-muted-foreground pl-4'>
								• {t('addedGuidePageLendower')}
								<br />• {t('fixedTranslationBugs')}
								<br />• {t('improvedRegistrationProcess')}
							</div>
						</div>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='font-medium'>v0.3.0</span>
								<span className='text-sm text-muted-foreground'>
									2025-12-26
								</span>
							</div>
							<div className='text-sm text-muted-foreground pl-4'>
								• {t('simplificationAdded')}
							</div>
						</div>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='font-medium'>v0.2.0</span>
								<span className='text-sm text-muted-foreground'>
									2025-10-13
								</span>
							</div>
							<div className='text-sm text-muted-foreground pl-4'>
								• {t('multiLanguageSupport')}
							</div>
						</div>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='font-medium'>v0.1.5</span>
								<span className='text-sm text-muted-foreground'>
									2025-07-10
								</span>
							</div>
							<div className='text-sm text-muted-foreground pl-4'>
								• {t('expenseTracking')}
								<br />• {t('groupManagement')}
								<br />• {t('friendSystem')}
							</div>
						</div>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<span className='font-medium'>v0.1.0</span>
								<span className='text-sm text-muted-foreground'>
									2025-04-01
								</span>
							</div>
							<div className='text-sm text-muted-foreground pl-4'>
								• {t('initialRelease')}
								<br />• {t('basicExpenseTracking')}
								<br />• {t('userAuthentication')}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
