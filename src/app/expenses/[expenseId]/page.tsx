import React from 'react'
import ExpenseData from './ExpenseData'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Expense details'
}

const ExpensePage = async ({
    params
}: {
    params: Promise<{ expenseId: string }>
}) => {
    const { expenseId } = await params
    return (
        <div className='flex flex-col gap-3 justify-start items-center h-screen  pt-18'>
            <ExpenseData expenseId={expenseId} />
        </div>
    )
}

export default ExpensePage
