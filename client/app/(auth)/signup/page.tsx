import { SignUpForm } from '@/components/SignUpForm'
import React from 'react'

export default function page() {
    return (
        <section>
            <div className="container mx-auto px-6">
                <div className="flex justify-center">
                    <div className="w-full md:w-3/6 py-10">
                        <SignUpForm />
                    </div>
                </div>

            </div>

        </section>
    )
}
