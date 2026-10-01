import { getAuthUser } from '@/lib/actions/user'

import React from 'react'
import ProfileDetails from './_components/ProfileDetails';

export default async function page() {
    const authUser = await getAuthUser()
    if (!authUser?.data?.id) {
        return (
            <div className="dashboard-container">
                <p>You must be logged in to view this page.</p>
            </div>
        );
    }
    return (
        <div className='flex justify-center'>
            <div className="w-full">
                <div className='mb-2'>
                    <div className='text-xl font-semibold'>Manager Profile</div>
                </div>
                {/* <SettingsForm user={authUser?.data} /> */}
                <ProfileDetails />
            </div>
        </div>
    )
}
