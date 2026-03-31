"use server"

import z from "zod"
import { signInValidation, signUpValidation } from "../validations"
import { cookies } from 'next/headers';
import { ActionState } from '../types/types';


export const signUp = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const formValues = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirm-password"),
            role: formData.get("role"),
        }

        const validate = await signUpValidation.parseAsync(formValues)

        const { confirmPassword, ...validatedData } = validate

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
            console.log(error)
            throw new Error("Something went wrong")
        }
    }
}



export const signIn = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const formValues = {
            email: formData.get("email"),
            password: formData.get("password"),
        }

        const validatedData = await signInValidation.parseAsync(formValues)

        const res = await fetch(`${process.env.API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validatedData)
        })

        if (res.status !== 201) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, token?: string, error: string | null }> = res.json()
        const data = await resData

        console.log(data)
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
