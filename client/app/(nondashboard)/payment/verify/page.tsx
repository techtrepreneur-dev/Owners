import { redirect } from "next/navigation";
import { cookies } from 'next/headers';
import { saveApplication } from "@/lib/actions/application";
import { updatePaymentStatus } from "@/lib/actions/payment";


interface PageProps {
    searchParams: Promise<{ reference?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
    const { reference } = await searchParams;

    if (!reference) {
        redirect("/payment/error")
    }

    // Verify the real status directly with Paystack's server
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
    });

    const paymentData = await response.json();

    // Paystack will return data.data.status as 'success', 'failed', or 'abandoned'
    if (paymentData.status && paymentData.data.status === "success") {

        const cookieStore = await cookies();
        const formValues = cookieStore.get('app-formvalues');

        const update = await updatePaymentStatus(reference)
        const app = await saveApplication(JSON.parse(formValues?.value || ""))

        if (!update.success) {
            redirect("/payment/error?message=Failed to update payment status")
            return
        }
        if (!app.success) {
            redirect("/payment/error?message=Failed to submit application")
            return
        }

        redirect("/payment/success")
    } else {
        redirect("/payment/error?message=Payment not completed")
    }

}