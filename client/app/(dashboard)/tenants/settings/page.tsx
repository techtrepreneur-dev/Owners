import SettingsForm from '@/components/SettingsForm'
import { getAuthUser } from '@/lib/actions/user'
import React from 'react'

export default async function page() {
    const authUser = (await getAuthUser())
    if (!authUser?.data?.id) {
        return (
            <div className="dashboard-container">
                <p>You must be logged in to view this page.</p>
            </div>
        );
    }
    return (
        <div className='flex justify-center'>
            <div className="w-full md:w-4/6">
                <div className='mb-2'>
                    <div className='text-2xl font-semibold'>Tenants Settings</div>
                    <p className='text-primary-500'>Manage your secure preference and personal information</p>
                </div>
                <SettingsForm user={authUser?.data} />
            </div>
        </div>
    )
}
