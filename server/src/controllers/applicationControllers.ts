import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listApplications = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { userId, userType } = req.query;

        let whereClause = {};

        if (userId && userType) {
            if (userType === "tenant") {
                whereClause = { tenantId: String(userId) };
            } else if (userType === "manager") {
                whereClause = {
                    property: {
                        managerId: String(userId),
                    },
                };
            }
        }

        const applications = await prisma.application.findMany({
            where: whereClause,
            include: {
                property: {
                    include: {
                        location: true,
                        manager: true,
                    },
                },
                tenant: true,
            },
        });

        res.status(200).json({ success: true, data: applications, error: null });

    } catch (error: any) {
        res.status(500)
            .json({ success: false, error: "Error retrieving applications" });
    }
};

export const createApplication = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            status,
            propertyId,
            tenantId,
            name,
            email,
            phoneNumber,
            message,
        } = req.body;

        const property = await prisma.property.findUnique({
            where: { id: Number(propertyId) }
        });

        if (!property) {
            res.status(404).json({ success: false, error: "Property not found" });
            return;
        }

        // Then create application with lease connection
        const application = await prisma.application.create({
            data: {
                applicationDate: new Date(),
                status,
                name,
                email,
                phoneNumber,
                message,
                property: {
                    connect: { id: Number(propertyId) },
                },
                tenant: {
                    connect: { id: Number(tenantId) },
                }

            },
            include: {
                property: true,
                tenant: true
            },
        });

        res.status(201).json({ success: true, error: null });

    } catch (error: any) {
        console.log(error.message)
        res
            .status(500)
            .json({ success: false, error: "Something went wrong with server. Try again" });
    }
};

export const approveApplication = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.body;

        const application = await prisma.application.update({
            where: { id: Number(id) },
            data: { status: "Approved" }
        });

        res.status(201).json({ success: true, data: application, error: null });

    } catch (error: any) {
        console.log(error.message)
        res
            .status(500)
            .json({ success: false, error: "Something went wrong with server. Try again" });
    }
};

export const cancleApplication = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id, userType } = req.body;
        let result;
        if (userType === 'tenant') {
            result = await prisma.application.delete({
                where: { id: Number(id) }
            });
        } else {
            result = await prisma.application.update({
                where: { id: Number(id) },
                data: { status: "Denied" }
            })
        }

        res.status(201).json({ success: true, data: result, error: null });

    } catch (error: any) {
        console.log(error.message)
        res
            .status(500)
            .json({ success: false, error: "Something went wrong with server. Try again" });
    }
};