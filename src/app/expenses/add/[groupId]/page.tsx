import AddExpenseForm from './AddExpenseForm'

const AddExpensePage = async ({
	params
}: {
	params: Promise<{ groupId: string }>
}) => {
	const { groupId } = await params

	return <AddExpenseForm groupId={groupId} />
}

export default AddExpensePage
