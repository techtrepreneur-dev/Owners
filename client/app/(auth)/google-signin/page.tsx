"use client"
import { GoogleSignIn } from "@/lib/actions/auth"
import { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    useEffect(() => {
        // 1. Define the async wrapper
        async function runAction() {
            setLoading(true)
            const result = await GoogleSignIn();
            if (result.success) {
                Cookies.set('session-token', result?.token || "", {
                    expires: 1,           // Sets maxAge to 1 day
                    path: '/',            // Available across the whole site
                    sameSite: 'lax',      // Standard CSRF protection
                    secure: false,        // Set to true in production (over HTTPS)
                    // httpOnly: true,    // ❌ ERROR: This option does not exist on the client
                })
                toast.success("Login successful!")
                router.replace("/landing")
            }
            if (result.error) {
                toast.error(result.error)
                router.replace("/signin")
            }
        }

        runAction();
    }, [router]);

    return (
        <div className="flex h-screen justify-center items-center bg-primary-100">
            {loading && (<div className="font-semibold tracking-wide block mt-3 transform animate-bounce"> <span className="text-3xl">O</span><span className="text-2xl">w</span><span className="text-xl">n</span><span className="text-sm text-secondary-800">ers</span> </div>)}
        </div>
    )
}
