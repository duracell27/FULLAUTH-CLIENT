import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'

export function useAdminDashboard() {
	const {
		data: dashboard,
		isLoading,
		error
	} = useQuery({
		queryKey: ['admin-dashboard'],
		queryFn: () => adminService.getDashboard()
	})

	return { dashboard, isLoading, error }
}
