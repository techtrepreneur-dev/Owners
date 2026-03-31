import SignInForm from '@/components/SignInForm'
import React from 'react'

export default function page() {
    return (
        <section>
            <div className="container mx-auto px-6">
                <div className="flex justify-center">
                    <div className="w-full md:w-3/6 py-10">
                        <SignInForm />
                    </div>
                </div>

            </div>

        </section>
    )
}
