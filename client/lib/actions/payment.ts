"use server"

import { cookies } from 'next/headers';

export const savePayment = async (type, email, amount, ref, id) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        const res = await fetch(`${process.env.API_BASE_URL}/payments`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token?.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                email: email,
                amount: amount,
                reference: ref,
                paymentStatus: "Pending",
                userId: Number(id),
            })

        })

        const resData: Promise<{ success: boolean, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error }
        }
        return { success: true, error: null }

    } catch (error) {
        console.log("Error saving payment " + error)
        return { success: false, error: "Server error saving payment: Try again" }
    }
}


export async function initializePaymentAction(email: string, amountInNaira: number) {

    // Multiply by 100 to convert to Kobo/Cents
    const amountInKobo = amountInNaira * 100;

    // 2. Call Paystack API
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Secure server-only key
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            amount: amountInKobo,
            // Optional: Paystack redirects back here after successful payment
            callback_url: "http://localhost:3000/payment/verify"

        }),
    });

    const data = await response.json();

    if (!data.status) {
        return { status: false, error: "Server error initializing payment: Try again" }
    }

    return data
}

export const updatePaymentStatus = async (reference: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        const res = await fetch(`${process.env.API_BASE_URL}/payments/update-status`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token?.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reference
            })

        })

        const resData: Promise<{ success: boolean, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, error: data.error }
        }
        return { success: true, error: null }

    } catch (error) {
        console.log("Error updating status " + error)
        return { success: false, error: "Server error updating status: Try again" }
    }
}