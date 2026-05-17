import { SignUpForm } from '@/components/auth/SignUpForm'
import React from 'react'

export default function page() {
    return (
        <section>
            <div className="container mx-auto px-3 md:px-7">
                <a href="/landing" className="font-semibold tracking-wide block mt-3"> <span className="text-3xl">O</span><span className="text-2xl">w</span><span className="text-xl">n</span><span className="text-sm text-secondary-800">ers</span> </a>
                <div className="flex justify-center">
                    <div className="w-full md:w-6/12 py-10">
                        <div className="text-xl font-semibold text-center  mb-8">Lets get you <span className="text-secondary-800 text-2xl font-bold ">Signed Up</span> </div>
                        <SignUpForm />
                    </div>
                </div>

            </div>

        </section>
    )
}
