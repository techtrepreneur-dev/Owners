"use client"

import { useActionState, useEffect, useState } from "react"
import { signUp } from "@/lib/actions/auth"
import { ActionState } from "@/lib/types/types"
import { EyeClosedIcon, EyeIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { stateData } from "@/lib/data"
import { useRouter } from "next/navigation"

const prevState: ActionState = { success: false, error: null, fieldErrors: null }

export function SignUpForm() {

    const [state, formAction, isLoading] = useActionState(signUp, prevState)

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast.success("User Account created!. Verify email to login")
            router.push("/signin")
        } else if (state.error) {
            toast.error(state.error)
        }
    }, [state])
    return (

        <form action={formAction} className="sand-500 shadow-lg p-5 rounded-2xl">
            <div className="mb-3">
                <label className="block text-primary-700 font-medium mb-1">
                    First Name
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Enter First Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-800"
                        required
                    />
                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.firstName}</p>
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-primary-700 font-medium mb-1">
                    Last Name
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Enter Last Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-800"
                        required
                    />
                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.lastName}</p>
                </div>
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

            <div className="mb-3">
                <label htmlFor="fullName" className="block text-primary-700 font-medium mb-1">
                    Phone Number
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="phone"
                        placeholder="0908..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-800"
                        required
                    />
                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.phone}</p>
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-primary-700 font-medium mb-1">
                    State of residence
                </label>
                <div className="relative">
                    <select name="state" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-800" required>
                        <option>Choose---</option>
                        {stateData.map((state) => (
                            <option key={state.id} value={state.name}>{state.name}</option>
                        ))}
                    </select>
                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.state}</p>
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-primary-700 font-medium mb-1">
                    Role
                </label>
                <div className="relative">
                    <select name="role" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-800" required>
                        <option>Choose---</option>
                        <option value="tenant">Tenant</option>
                        <option value="manager">Agent/Owner</option>
                    </select>
                    <p className="text-xs text-red-500 font-semiboldy">{state?.fieldErrors?.role}</p>
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

            {/* Terms and Conditions */}
            <div className="flex items-start mt-4">
                <input
                    type="checkbox"
                    id="agreedToTerms"
                    name="agreedToTerms"
                    // checked={formData.agreedToTerms}
                    // onChange={handleChange}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    required
                />
                <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-700">
                    By creating an account, I agree to our{' '}
                    <Link href="/terms" className="text-green-700 hover:text-green-800">
                        Terms of use
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-green-700 hover:text-green-800">
                        Privacy Policy
                    </Link>
                </label>
            </div>

            {/* Submit Button */}
            <button
                disabled={isLoading}
                type="submit"
                className="w-full bg-secondary-800 flex justify-center items-center text-white py-2 px-4 rounded-md hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 mt-6"
            >
                {isLoading ? <Loader2 className="transform animate-spin" /> : "Sign Up"}
            </button>

            {/* Login Link */}
            <div className="text-center mt-6">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-green-700 hover:text-green-800">
                        Sign In
                    </Link>
                </p>
            </div>
        </form>
    )
}
