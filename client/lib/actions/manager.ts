"use server"
import z from "zod"
import { cookies } from 'next/headers';
import { ActionState } from '../types/types';
import { Property } from "../types/prismaTypes";



export async function getManagerProperties(id: number) {

    const cookieStore = await cookies();
    const token = cookieStore.get('session-token');

    if (!token) return null


    const res = await fetch(`${process.env.API_BASE_URL}/managers/${id}/properties`, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    }
    )

    const resData: Promise<{ success: boolean, data: Property[] | null, error: string | null }> = res.json()
    const data = await resData

    if (!data.success) {
        return { success: false, data: null, error: data.error }
    }

    return { success: true, data: data.data, error: null }
}

