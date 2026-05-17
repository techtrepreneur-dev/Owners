"use server"

import z from "zod"
import { changePasswordValidation, resendEmailValidation, signInValidation, signUpValidation, verifyPasswordOTP } from "../validations"
import { cookies } from 'next/headers';
import { ActionState } from '../types/types';
import { signIn } from "@/auth"
import { auth } from "@/auth";
import { Resend } from "resend";
import VerificationEmail from "@/emails/auth/VerificationEmail";
import ForgetPasswordOtp from "@/emails/auth/ForgetPassswordOtp";


const resend = new Resend(process.env.RESEND_API_KEY);


export const signUp = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const formValues = {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            state: formData.get("state"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
            role: formData.get("role"),
        }

        const validate = await signUpValidation.parseAsync(formValues)

        const { confirmPassword, ...validatedData } = validate


        // send verification link
        const sendEmail = await sendEmailVerificationLink(validatedData.firstName, validatedData.email)

        if (!sendEmail) {
            return { success: false, error: "Email verification not sent, try again", fieldErrors: null }
        }

        const res = await fetch(`${process.env.API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validatedData)
        })

        if (res.status !== 201) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error, fieldErrors: null }
        }

        return { success: true, error: null, fieldErrors: null }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return { success: false, error: null, fieldErrors }
        }
        else {
            console.log(error.message)
            throw new Error("Something went wrong")
        }
    }
}



export const manualSignIn = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const formValues = {
            email: formData.get("email"),
            password: formData.get("password"),
        }

        const validatedData = await signInValidation.parseAsync(formValues)

        const res = await fetch(`${process.env.API_BASE_URL}/auth/manual-signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validatedData)
        })

        if (res.status !== 200) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, token?: string, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error, fieldErrors: null }
        }

        const cookieStore = await cookies();

        // Set cookie options
        cookieStore.set({
            name: 'session-token',
            value: data.token || "",
            httpOnly: true,
            secure: false, // Use secure cookies in production
            maxAge: 60 * 60 * 24 * 1, // 1 day
            path: '/',
            sameSite: 'lax',
        })

        return { success: true, error: null, fieldErrors: null }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return { success: false, error: null, fieldErrors }
        }
        else {
            console.log(error)
            throw new Error("Something went wrong")
        }
    }
}

export const GoogleSignIn = async () => {

    try {

        const session = await auth()
        const email = session?.user?.email


        const res = await fetch(`${process.env.API_BASE_URL}/auth/google-signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })

        if (res.status !== 200) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, token?: string, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, token: null, error: data.error }
        }

        return { success: true, token: data.token, error: null }

    } catch (error) {
        console.log(error.message)
        return { success: false, error: "Something went worng" }
    }
}

export async function googleSignIn() {
    await signIn("google", { redirectTo: "/google-signin" })
}

export async function sendEmailVerificationLink(firstName: string, email: string) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hr

    // 2. Send via Resend
    const sendMail = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: "techtrepreneur.dev@gmail.com",
        subject: "Your verification code",
        react: VerificationEmail({ firstName, email, token }),
    });
    if (!sendMail.data) return false

    // 1. Store in DB
    const res = await fetch(`${process.env.API_BASE_URL}/auth/email/save-verification-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, token, expiresAt })
    })

    if (res.status !== 201) {
        throw new Error("Unable to save code")
        return false
    }

    const resData: Promise<{ success: boolean, error: string | null }> = res.json()
    const data = await resData

    if (!data.success) return false

    return true;
}

export async function verifyEmailVerificationToken(email: string | null, token: string | null) {

    const res = await fetch(`${process.env.API_BASE_URL}/auth/email/verify-email-verification-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, token })
    })

    if (res.status !== 200) {
        console.log(res)
    }

    const resData: Promise<{ success: boolean, error: string | null }> = res.json()
    const data = await resData

    if (!data.success) {
        return { success: false, error: data.error }
    }

    return { success: true, error: null }
}

export const resendEmailVerificationLink = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const formValues = {
            email: formData.get("email"),
        }

        const validatedData = await resendEmailValidation.parseAsync(formValues)

        const sendEmail = await sendEmailVerificationLink("there", validatedData.email)

        if (!sendEmail) {
            return { success: false, error: "Email verification not sent, try again", fieldErrors: null }
        }
        return { success: true, error: null, fieldErrors: null }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return { success: false, error: null, fieldErrors }
        }
        else {
            console.log(error)
            throw new Error("Something went wrong")
        }
    }
}


export async function forgetPasswordOTP(firstName: string, email: string) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hr

    // 2. Send via Resend
    const sendMail = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: "techtrepreneur.dev@gmail.com",
        subject: "One Time Password",
        react: ForgetPasswordOtp({ firstName, token }),
    });
    if (!sendMail.data) return false

    // 1. Store in DB
    const res = await fetch(`${process.env.API_BASE_URL}/auth/email/save-forget-password-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, token, expiresAt })
    })

    if (res.status !== 201) {
        throw new Error("Unable to save code")
        return false
    }

    const resData: Promise<{ success: boolean, error: string | null }> = res.json()
    const data = await resData

    if (!data.success) return false

    return true;
}

export const sendForgetPasswordOTP = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const formValues = {
            email: formData.get("email"),
        }

        const validatedData = await resendEmailValidation.parseAsync(formValues)

        const sendEmail = await forgetPasswordOTP("there", validatedData.email)

        if (!sendEmail) {
            return { success: false, error: "OTP not sent, try again", fieldErrors: null }
        }
        return { success: true, error: null, fieldErrors: null }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return { success: false, error: null, fieldErrors }
        }
        else {
            console.log(error)
            throw new Error("Something went wrong")
        }
    }
}

export const verifyForgetPasswordOTP = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const formValues = {
            otp: formData.get("otp"),
        }
        console.log(typeof Number(formData.get("otp")))

        const validatedData = await verifyPasswordOTP.parseAsync(formValues)

        const res = await fetch(`${process.env.API_BASE_URL}/auth/email/verify-forget-password-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: validatedData.otp })
        })

        if (res.status !== 200) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error, fieldErrors: null }
        }

        return { success: true, error: null, fieldErrors: null }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return { success: false, error: null, fieldErrors }
        }
        else {
            console.log(error)
            throw new Error("Something went wrong")
        }
    }
}

export const changePassword = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const formValues = {
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        }

        const validate = await changePasswordValidation.parseAsync(formValues)

        const { confirmPassword, ...validatedData } = validate


        const res = await fetch(`${process.env.API_BASE_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validatedData)
        })

        if (res.status !== 201) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error, fieldErrors: null }
        }

        return { success: true, error: null, fieldErrors: null }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return { success: false, error: null, fieldErrors }
        }
        else {
            console.log(error.message)
            throw new Error("Something went wrong")
        }
    }
}

