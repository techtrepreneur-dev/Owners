import SignInForm from '@/components/auth/SignInForm'
import React from 'react'

export default function page() {
    return (
        <section>
            <div className="container mx-auto px-6">
                <a href="/landing" className="font-semibold tracking-wide block mt-3"> <span className="text-3xl">O</span><span className="text-2xl">w</span><span className="text-xl">n</span><span className="text-sm text-secondary-800">ers</span> </a>
                <div className="flex justify-center">
                    <div className="w-full md:w-5/12 py-10">
                        <div className="text-2xl font-semibold text-center mb-5">Sign <span className="text-secondary-800">in</span></div>
                        <SignInForm />
                    </div>
                </div>

            </div>

        </section>
    )
}
