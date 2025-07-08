import { useExpense } from '@/shared/hooks/useExpense'
import React from 'react'
import AddExpenseForm from '../../add/[groupId]/AddExpenseForm'

type Props = {}

const editExpensePage = async ({
	params
}: {
	params: Promise<{ expenseId: string }>
}) => {
	const { expenseId } = await params

	return (
		<div className='flex flex-col gap-3 justify-center items-center h-screen w-full max-w-[400px] mt-35'>
			<div className='flex justify-between items-center w-full '>
				<AddExpenseForm groupId={'12cc71d0-7eef-465c-849c-edbfb668bfdb'} expenseId={expenseId} edit={true} />
			</div>
		</div>
	)
}

export default editExpensePage
