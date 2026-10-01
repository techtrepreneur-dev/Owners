"use server"

import z from "zod"
import { applicationValidation } from "../validations"
import { cookies, headers } from 'next/headers';
import { Application, PaymentStatus, Property } from "../types/prismaTypes";
import { redirect } from "next/navigation";
import { initializePaymentAction, savePayment } from "./payment";
import { revalidatePath } from "next/cache";


export type ActionState = {
    success: boolean;
    error: string | null;
    url: string | null;
    fieldErrors: Record<string, string[]> | null;
};


export const createApplication = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    try {
        const formValues = {
            name: formData.get("name"),
            email: formData.get("email"),
            phoneNumber: formData.get("phone"),
            message: formData.get("message"),

            tenantId: formData.get("tenantId"),
            propertyId: formData.get("propertyId"),
            status: formData.get("status")
        }

        const validatedData = await applicationValidation.parseAsync(formValues)

        const payment = await initializePaymentAction(validatedData.email, 50)
        if (!payment.status) {
            return { success: false, error: payment.error, url: null, fieldErrors: null }
        }

        const res = await savePayment("application", validatedData.email, 50, payment.data.reference, formValues.tenantId)

        if (!res.success) {
            return { success: false, error: res.error, url: null, fieldErrors: null }
        }

        const headersList = await headers();
        const referer = headersList.get('referer'); // Returns the full URL (e.g., "http://localhost:3000/dashboard?user=123")
        // Set cookie options
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'app-formvalues',
            value: JSON.stringify(formValues) || "",
            httpOnly: true,
            secure: false, // Use secure cookies in production
            maxAge: 60 * 60 * 1 * 1, // 1 hr
            path: '/',
            sameSite: 'lax',
        })
        cookieStore.set({
            name: 'prev-url',
            value: referer || "",
            httpOnly: true,
            secure: false, // Use secure cookies in production
            maxAge: 60 * 60 * 1 * 1, // 1 hr
            path: '/',
            sameSite: 'lax',
        })

        // 3. Redirect user to Paystack's hosted checkout page
        return { success: true, error: null, url: payment.data.authorization_url, fieldErrors: null };



    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return { success: false, error: null, url: null, fieldErrors }
        }
        else {
            console.log("Error creating Application " + error)
            return { success: false, error: "Server error creating Application: Try again", url: null, fieldErrors: null }
        }
    }
}

export async function listApplications(id: number, type: string) {

    const cookieStore = await cookies();
    const token = cookieStore.get('session-token');

    if (!token) return null


    const res = await fetch(`${process.env.API_BASE_URL}/applications/${id}/${type}`, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    }
    )

    const resData: Promise<{ success: boolean, data: Application[] | null, error: string | null }> = res.json()
    const data = await resData

    if (!data.success) {
        return { success: false, data: null, error: data.error }
    }

    return { success: true, data: data.data, error: null }
}

export const saveApplication = async (formValues) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        const res = await fetch(`${process.env.API_BASE_URL}/applications/`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token?.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formValues)
        })

        if (res.status !== 201) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error }
        }
        return { success: true, error: null }

    } catch (error) {
        console.log("Error saving Application " + error)
        return { success: false, error: "Server error saving Application: Try again" }
    }
}

export const approveApplication = async (prevState: unknown, id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        const res = await fetch(`${process.env.API_BASE_URL}/applications/approve`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token?.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })

        if (res.status !== 201) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, data?: Application, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error }
        }
        return { success: true, data: data.data, error: null }

    } catch (error) {
        console.log("Error accepting Application " + error)
        return { success: false, error: "Server error accepting Application: Try again" }
    }
}

export const cancleApplication = async (prevState: unknown, { id, userType }: { id: string, userType: string }) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        const res = await fetch(`${process.env.API_BASE_URL}/applications/cancle`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token?.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, userType })
        })

        if (res.status !== 201) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, data?: Application, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error }
        }
        console.log(data.data)

        return { success: true, data: data.data, error: null }

    } catch (error) {
        console.log("Error cancling Application " + error)
        return { success: false, error: "Server error cancling Application: Try again" }
    }
}



