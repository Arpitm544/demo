import React, { useCallback, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Sidebar } from 'lucide-react'
import axios from 'axios'
import { Outlet } from 'react-router-dom'

const Layout = ({ user = {}, onLogout }) => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchTask = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('token')
            if (!token)
                throw new Error('No auth token found')

            const { data } = await axios.get('http://localhost:4000/api/tasks/gp', {
                headers: { Authorization: `Bearer ${token}` }
            })

            setTasks(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTask()
    }, [fetchTask])

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar user={user} onLogout={onLogout} />
            <Sidebar user={user} tasks={tasks} />
            <div className='ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300'>
                <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>
                    <div className='xl:col-span-2 space-y-3 sm:space-y-4'>
                        <Outlet context={{ tasks, refreshTask: fetchTask }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout