"use client"
import { resendEmailVerificationLink } from '@/lib/actions/auth'
import { Loader2, SendIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

const prevState: ActionState = { success: false, error: null, fieldErrors: null }

export default function Page() {

    const [state, formAction, isLoading] = useActionState(resendEmailVerificationLink, prevState)

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast.success("Email Verification sent, Check you mail")
            // router.replace("/signing")
        } else if (state.error) {
            toast.error(state.error)
        }
    }, [state, router])

    return (
        <section>
            <div className="container mx-auto px-6">
                <a href="/landing" className="font-semibold tracking-wide block mt-3"> <span className="text-3xl">O</span><span className="text-2xl">w</span><span className="text-xl">n</span><span className="text-sm text-secondary-800">ers</span> </a>
                <div className="flex justify-center sand-500">
                    <div className="w-full md:w-5/12 py-10">
                        <div className='flex justify-center'><Image src="/email.png" width={1000} height={1000} alt="" className='size-20' /></div>
                        <div className="text-xl font-semibold mt-3 mb-3">Hello th<span className="text-secondary-800">ere! </span></div>
                        <div className="text-sm mb-4">If you're seeing this page it means your email verification link has expired. Please input your email and click the button below to resend verification link</div>
                        <div className="text-xs mb-5 font-bold">Note: Use the email used when signing up</div>

                        <div className=''>
                            <form action={formAction} className='w-full'>
                                <div className="mb-5">
                                    <label className="block text-primary-700 font-medium mb-1">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="youremail@gail.com"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-800"
                                            required
                                        />
                                        <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.email}</p>
                                    </div>
                                </div>
                                <div className='flex justify-center'>
                                    <button disabled={isLoading} className='flex items-center gap-1 bg-primary-700  hover:bg-primary-600 transition-all duration-300  text-sm font-semibold text-primary-100 rounded cursor-pointer px-5 py-2'>{isLoading ? <Loader2 className='transform animate-spin' /> : <>Send <SendIcon className='size-4' /></>}  </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
