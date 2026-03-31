"use server"
import z from "zod"
import { cookies } from 'next/headers';
import { ActionState } from '../types/types';
import { Tenant } from "../types/prismaTypes";
import { revalidatePath } from "next/cache";



export async function getTenent(id: number) {

    const cookieStore = await cookies();
    const token = cookieStore.get('session-token');

    if (!token) return null


    const res = await fetch(`${process.env.API_BASE_URL}/tenants/${id}`, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    }
    )

    const resData: Promise<{ success: boolean, data: Tenant | null, error: string | null }> = res.json()
    const data = await resData

    if (!data.success) {
        return { success: false, data: null, error: data.error }
    }

    return { success: true, data: data.data, error: null }
}

export async function addFavourite(prevState, idsObj) {

    try {
        const { tenantId, propertyId } = idsObj

        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        if (!token) return null


        const res = await fetch(`${process.env.API_BASE_URL}/tenants/${tenantId}/favorites/${propertyId}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token?.value}`
            }
        }
        )

        if (res.status !== 201) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, data: Tenant, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, data: null, error: data.error }
        }

        return { success: true, data: data.data, error: null }

    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong")
    }
}

export async function removeFavourite(prevState, idsObj) {

    try {
        const { tenantId, propertyId } = idsObj

        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        if (!token) return null


        const res = await fetch(`${process.env.API_BASE_URL}/tenants/${tenantId}/favorites/${propertyId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token?.value}`
            }
        }
        )

        if (res.status !== 200) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, data: Tenant, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, data: null, error: data.error }
        }

        return { success: true, data: data.data, error: null }

    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong")
    }

}
