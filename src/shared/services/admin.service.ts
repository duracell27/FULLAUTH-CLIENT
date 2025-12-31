import { api } from '../utils/api'

/**
 * Типи витрат
 */
export enum SplitType {
	EQUAL = 'EQUAL',
	CUSTOM = 'CUSTOM',
	PERCENTAGE = 'PERCENTAGE',
	SHARES = 'SHARES',
	EXTRA = 'EXTRA'
}

/**
 * GET /admin/users/count
 */
export interface UsersCountResponse {
	total: number // Загальна кількість користувачів
	active: number // Активні за останні 30 днів
}

/**
 * GET /admin/expenses/count
 */
export interface ExpensesCountResponse {
	total: number // Загальна кількість витрат
	lastMonth: number // За останні 30 днів
}

/**
 * GET /admin/groups/count
 */
export interface GroupsCountResponse {
	total: number // Загальна кількість груп
	finished: number // Завершені групи
	active: number // Активні групи
}

/**
 * Статистика одного типу витрат
 */
export interface ExpenseTypeStatistic {
	type: SplitType
	count: number
	percentage: string // наприклад "79.92"
}

/**
 * GET /admin/expenses/statistics
 */
export interface ExpenseTypeStatisticsResponse {
	total: number
	statistics: ExpenseTypeStatistic[]
}

/**
 * GET /admin/dashboard
 * Повна статистика для дашборду
 */
export interface AdminDashboardResponse {
	users: {
		total: number
		active: number
	}
	expenses: {
		total: number
		lastMonth: number
	}
	groups: {
		total: number
		finished: number
		active: number
	}
	expenseTypeStatistics: ExpenseTypeStatistic[]
}

class AdminService {
	public async getUsersCount() {
		const response = await api.get<UsersCountResponse>('admin/users/count')
		return response
	}

	public async getExpensesCount() {
		const response = await api.get<ExpensesCountResponse>(
			'admin/expenses/count'
		)
		return response
	}

	public async getGroupsCount() {
		const response = await api.get<GroupsCountResponse>('admin/groups/count')
		return response
	}

	public async getExpenseStatistics() {
		const response = await api.get<ExpenseTypeStatisticsResponse>(
			'admin/expenses/statistics'
		)
		return response
	}

	public async getDashboard() {
		const response = await api.get<AdminDashboardResponse>('admin/dashboard')
		return response
	}
}

export const adminService = new AdminService()
