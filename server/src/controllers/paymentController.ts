import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const savePayment = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const data = req.body;

        const payment = await prisma.payment.create({
            data: data
        });

        res.status(201).json({ success: true, error: null });

    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ success: false, error: "Something went wrong while saving payment. Try again" });
    }
};

export const updatePaymentStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const data = req.body;

        const payment = await prisma.payment.update({
            where: { reference: data.reference },
            data: { paymentStatus: "Paid" }
        });

        res.status(201).json({ success: true, error: null });

    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ success: false, error: "Something went wrong while updating status. Try again" });
    }
};
