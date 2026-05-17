"use client"
import { changePassword, sendForgetPasswordOTP } from '@/lib/actions/auth'
import { EyeClosedIcon, EyeIcon, File, Loader2, } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'

const prevState: ActionState = { success: false, error: null, fieldErrors: null }

export default function Page() {

    const [state, formAction, isLoading] = useActionState(changePassword, prevState)

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast.success("Password updated successfull, Proceed to login")
            router.replace("/signin")
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
                        <div className='flex justify-center'><Image src="/passcode.png" width={1000} height={1000} alt="" className='size-20' /></div>
                        <div className="text-xl font-semibold mt-3 mb-3">Change Passw<span className="text-secondary-800">ord </span></div>
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

                                {/* Password */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="block text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter Password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeClosedIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.password}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Use 8 or more characters with a mix of letters, numbers & symbols
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Enter Confirm Password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeClosedIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.confirmPassword}</p>
                                </div>


                                <div className='flex justify-center mt-5'>
                                    <button disabled={isLoading} className='flex items-center gap-1 bg-primary-700  hover:bg-primary-600 transition-all duration-300  text-sm font-semibold text-primary-100 rounded cursor-pointer px-5 py-2'>{isLoading ? <Loader2 className='transform animate-spin' /> : <>Save <File className='size-4' /></>}  </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
