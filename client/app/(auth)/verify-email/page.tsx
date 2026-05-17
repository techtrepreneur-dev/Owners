"use client"
import { verifyEmailVerificationToken } from '@/lib/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function Page() {
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(false)
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const router = useRouter()
    useEffect(() => {
        // 1. Define the async wrapper
        async function runAction() {
            setLoading(true)
            const result = await verifyEmailVerificationToken(email, token);

            if (result.success) {
                toast.success("Email verified!. Proceed to login")
                router.replace("/signin")
            }
            if (result.error) {
                toast.error(result.error)
                router.replace("/resend-verification-email")
            }
        }

        runAction();
    }, [router, email, token]);

    return (
        <div className="flex h-screen justify-center items-center bg-primary-100">
            {loading && (<div className="font-semibold tracking-wide block mt-3 transform animate-bounce"> <span className="text-3xl">O</span><span className="text-2xl">w</span><span className="text-xl">n</span><span className="text-sm text-secondary-800">ers</span> </div>)}
        </div>
    )
}
