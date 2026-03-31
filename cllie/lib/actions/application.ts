"use server"

import z from "zod"
import { applicationValidation } from "../validations"
import { cookies } from 'next/headers';


export type ActionState = {
    success: boolean;
    error: string | null;
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


        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        console.log(formValues)
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