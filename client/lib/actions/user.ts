"use server"
import z from "zod"
import { cookies } from 'next/headers';
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ActionState } from '../types/types';
import { updateUserValidation } from '../validations';
import { revalidatePath } from "next/cache";

import {
    Application,
    Lease,
    Manager,
    Payment,
    Property,
    Tenant,
} from "@/lib/types/prismaTypes";
import { auth } from "@/auth"
interface DecodedToken extends JwtPayload {
    sub: string;
    "id": string;
    "email": string;
    "role": string;
}

export async function getAuthUser() {
    try {

        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');
        const session = await auth()

        if (!token && !session) return null

        const decoded: DecodedToken = jwt.decode(token?.value);

        const email = decoded?.email || session?.user?.email
        console.log(email)

        const res = await fetch(process.env.API_BASE_URL + "/auth/user",

            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token?.value}`
                },
                body: JSON.stringify({ email })
            }
        )

        const resData: Promise<{ success: boolean, data: Tenant | Manager | null, error: string | null }> = res.json()
        const user = await resData

        if (!user.success) return null
        return user

    } catch (error: any) {
        console.log(error)
    }
}

export async function updateUser(prevState: ActionState, formData: FormData): Promise<ActionState> {

    try {

        const formValues = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
        }

        const validatedData = await updateUserValidation.parseAsync(formValues)

        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        const decoded: DecodedToken = jwt.decode(token?.value);
        const { id, role } = decoded


        const res = await fetch(`${process.env.API_BASE_URL}/${role}s/${id}`,

            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token?.value}`
                },
                body: JSON.stringify(validatedData)
            }
        )

        const resData: Promise<{ success: boolean, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error, fieldErrors: null }
        }

        revalidatePath(`/${role}s/settings`)
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

