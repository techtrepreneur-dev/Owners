"use client"
import { updateUser } from '@/lib/actions/user'
import { ActionState } from '@/lib/types/types'
import { Loader2 } from 'lucide-react'
import React, { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

export default function SettingsForm({ user }) {
    const prevState: ActionState = { success: false, error: null, fieldErrors: null }


    const [state, formAction, isLoading] = useActionState(updateUser, prevState)

    useEffect(() => {
        if (state.success) {
            toast.success("User Updated")

        } else if (!state.success && !state.fieldErrors) {
            toast.error(state.error)
        }
    }, [state])


    return (
        <div className='bg-white rounded-lg p-5'>
            <form action={formAction} className='w-full'>
                <div className='mb-3'>
                    <div className='font-semibold text-sm mb-0.5 text-primary-600'>Name</div>
                    <input type="text" name="name" defaultValue={user.name} className='border p-[5] w-full rounded border-primary-200' placeholder='Name' />
                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.name}</p>

                </div>
                <div className='mb-3'>
                    <div className='font-semibold text-sm mb-0.5 text-primary-600'>Email</div>
                    <input type="email" name="email" defaultValue={user.email} className='border p-[5] w-full rounded border-primary-200' placeholder='email' readOnly />
                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.email}</p>
                </div>
                <div className='mb-3'>
                    <div className='font-semibold text-sm mb-0.5 text-primary-600'>Phone Number</div>
                    <input type="text" name="phone" defaultValue={user.phone} className='border p-[5] w-full rounded border-primary-200' placeholder='Phone  number' />
                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.phone}</p>
                </div>
                <div className='flex justify-end'>
                    <button className='rounded bg-secondary-600 text-white p-2 cursor-pointer'>{isLoading ? <Loader2 className='animate-spin' /> : "Save changes"} </button>
                </div>
            </form>
        </div>
    )
}
