import { LuLoader } from 'react-icons/lu'
import { useTranslations } from '@/shared/hooks'

export function Loading() {
	const { t } = useTranslations()
	
	return (
		<div className='flex text-foreground items-center justify-center text-sm my-8'>
			<LuLoader className='mr-2 size-12 animate-spin' />
			{t('loading')}
		</div>
	)
}
