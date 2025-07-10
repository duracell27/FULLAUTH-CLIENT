import { Metadata } from 'next'
import AddExpenseForm from './AddExpenseForm'

export const metadata: Metadata = {
	title: 'Add expense'
}

const AddExpensePage = async ({
	params
}: {
	params: Promise<{ groupId: string }>
}) => {
	const { groupId } = await params

	return <AddExpenseForm groupId={groupId} />
}

export default AddExpensePage
