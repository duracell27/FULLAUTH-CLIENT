import React from 'react'
import { Metadata } from 'next'
import { AdminDashboard } from './AdminDashboard'

export const metadata: Metadata = {
	title: 'Admin Panel'
}

const AdminPage = () => {
	return <AdminDashboard />
}

export default AdminPage
