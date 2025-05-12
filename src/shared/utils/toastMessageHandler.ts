import { toast } from 'sonner'

export function toastMessageHandler(error: Error) {
	if (error.message) {
		const errorMessage = error.message
		toast.error(errorMessage)
	} else {
		toast.error('Something went wrong')
	}
}
