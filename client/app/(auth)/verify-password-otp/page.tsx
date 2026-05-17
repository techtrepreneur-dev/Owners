"use client"
import { verifyForgetPasswordOTP } from '@/lib/actions/auth'
import { Loader2, Lock, } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useActionState, useEffect } from 'react'
import { toast } from 'sonner'

const prevState: ActionState = { success: false, error: null, fieldErrors: null }

export default function Page() {

    const [state, formAction, isLoading] = useActionState(verifyForgetPasswordOTP, prevState)

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast.success("OTP verified")
            router.replace("/change-password")
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
                        <div className='flex justify-center'><Image src="/otp.png" width={1000} height={1000} alt="" className='size-20' /></div>
                        <div className="text-xl font-semibold mt-3 mb-3">Verify<span className="text-secondary-800"> OTP </span></div>
                        <div className="text-sm mb-4">Check your mail for the OTP code and input below</div>

                        <div className=''>
                            <form action={formAction} className='w-full'>
                                <div className="mb-5">
                                    <label className="block text-primary-700 font-semibold mb-1">
                                        OTP
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="otp"
                                            className="w-full px-4 py-2 border border-gray-300 tracking-[10px] font-bold text-center rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-800"
                                            required
                                        />
                                        <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.otp}</p>
                                    </div>
                                </div>
                                <div className='flex justify-center'>
                                    <button disabled={isLoading} className='flex items-center gap-1 bg-primary-700  hover:bg-primary-600 transition-all duration-300  text-sm font-semibold text-primary-100 rounded cursor-pointer px-5 py-2'>{isLoading ? <Loader2 className='transform animate-spin' /> : <>Verify <Lock className='size-4' /></>}  </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
