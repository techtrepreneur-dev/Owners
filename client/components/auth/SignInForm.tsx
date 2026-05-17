"use client"

import { useActionState, useEffect, useState } from "react"
import { manualSignIn } from "@/lib/actions/auth"
import { ActionState } from "@/lib/types/types"
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GoogleLoginButton from "./GoogleLoginButton"

const prevState: ActionState = { success: false, error: null, fieldErrors: null }

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isLoading] = useActionState(manualSignIn, prevState)
    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast.success("Login successfull!")

            router.replace("/landing")
        } else if (state.error) {
            toast.error(state.error)
        }
    }, [state, router])

    return (
        <form action={formAction} className="sand-500 shadow-lg p-5 rounded-2xl">
            <div className="flex justify-end my-2">
                <div className="border border-secondary-800 rounded-md py-1 px-2"><GoogleLoginButton /></div>
            </div>
            <div className="mb-3">
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        // checked={formData.rememberMe}
                        // onChange={handleChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                        Remember me
                    </label>
                </div>
                <div>
                    <Link href="/forget-password" className="text-sm text-green-700 hover:text-green-800">
                        Forgot Password?
                    </Link>
                </div>
            </div>

            {/* Submit Button */}
            <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-secondary-800 flex justify-center items-center text-white py-2 px-4 rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 mt-6"
            >
                {isLoading ? <Loader2 className="transform animate-spin" /> : "Sign In"}
            </button>


            {/* Login Link */}
            <div className="text-center mt-6">
                <p className="text-gray-600">
                    Dont have an account?{' '}
                    <Link href="/signup" className="text-green-700 hover:text-green-800">
                        Sign Up
                    </Link>
                </p>
            </div>
        </form>
    )
}