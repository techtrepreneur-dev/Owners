import { googleSignIn } from "@/lib/actions/auth"

export default function GoogleLoginButton() {
    return (
        <div
            onClick={googleSignIn}
            className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] bg-clip-text px-2 text-transparent text-lg sand-600 cursor-pointer inline-block"
        >
            Google Login
        </div>
    )
}