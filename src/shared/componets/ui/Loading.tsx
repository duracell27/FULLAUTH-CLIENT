import { LuLoader } from 'react-icons/lu'

export function Loading() {
	return (
		<div className='flex text-foreground items-center justify-center text-sm my-8'>
			<LuLoader className='mr-2 size-12 animate-spin' />
			Loading...
		</div>
	)
}
