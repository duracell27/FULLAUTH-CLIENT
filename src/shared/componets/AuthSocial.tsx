import React from 'react'
import { Button } from './ui'
import { FaGoogle } from 'react-icons/fa'

type Props = {}

export const AuthSocial = (props: Props) => {
	return (
		<>
			<div className='grid grid-cols-1'>
				<Button variant='outline'>
					<FaGoogle className='mr-2 size-4' />
					Google
				</Button>
			</div>
			<div className='my-3 flex items-center justify-center'>
				<div className="border-b border-muted-foreground w-full"></div>
				<div className="uppercase text-xs font-semibold ml-2 mr-2 text-muted-foreground">or</div>
				<div className="border-b border-muted-foreground w-full"></div>
			</div>
		</>
	)
}
