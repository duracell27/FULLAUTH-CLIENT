import { useMutation } from '@tanstack/react-query'
import { TypeLoginSchema } from '../schemas'
import { authService } from '../services'
import { toastMessageHandler } from '../utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useLoginMutation(setIsShowFactor: React.Dispatch<React.SetStateAction<boolean>>) {

	const router = useRouter()
	const {mutate: login, isPending: isLoadingLogin} = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: TypeLoginSchema
			recaptcha: string
		}) => authService.login(values, recaptcha),
		onSuccess: (data:any) => {
            if(data.message){
				toastMessageHandler(data)
				setIsShowFactor(true)
			}else{
				toast.success('User logged in successfully')
				router.push('/dashboard/settings')
			}
        },
		onError: (error) => {
            toastMessageHandler(error)
        }
	})

    return {login, isLoadingLogin}
}
