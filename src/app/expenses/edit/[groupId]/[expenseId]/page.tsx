import React from 'react'
import AddExpenseForm from '../../../add/[groupId]/AddExpenseForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Edit expense'
}

const editExpensePage = async ({
	params
}: {
	params: Promise<{ groupId: string; expenseId: string }>
}) => {
	const { groupId, expenseId } = await params

	return (
		<div className='flex flex-col gap-3 justify-center items-center h-screen w-full max-w-[400px] mt-35'>
			<div className='flex justify-between items-center w-full '>
				<AddExpenseForm 
					groupId={groupId}
					expenseId={expenseId} 
					edit={true} 
				/>
			</div>
		</div>
	)
}

export default editExpensePage
