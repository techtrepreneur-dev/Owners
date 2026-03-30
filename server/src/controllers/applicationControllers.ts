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

        function calculateNextPaymentDate(startDate: Date): Date {
            const today = new Date();
            const nextPaymentDate = new Date(startDate);
            while (nextPaymentDate <= today) {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            }
            return nextPaymentDate;
        }

        const formattedApplications = await Promise.all(
            applications.map(async (app) => {
                const lease = await prisma.lease.findFirst({
                    where: {
                        tenant: {
                            id: app.tenantId,
                        },
                        propertyId: app.propertyId,
                    },
                    orderBy: { startDate: "desc" },
                });

                return {
                    ...app,
                    property: {
                        ...app.property,
                        address: app.property.location.address,
                    },
                    manager: app.property.manager,
                    lease: lease
                        ? {
                            ...lease,
                            nextPaymentDate: calculateNextPaymentDate(lease.startDate),
                        }
                        : null,
                };
            })
        );

        res.json(formattedApplications);
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error retrieving applications: ${error.message}` });
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
            where: { id: Number(propertyId) },
            select: { pricePerMonth: true, securityDeposit: true },
        });

        if (!property) {
            res.status(404).json({ message: "Property not found" });
            return;
        }

        // const newApplication = await prisma.$transaction(async (prisma) => {
        // Create lease first
        // const lease = await prisma.lease.create({
        //     data: {
        //         startDate: new Date(), // Today
        //         endDate: new Date(
        //             new Date().setFullYear(new Date().getFullYear() + 1)
        //         ), // 1 year from today
        //         rent: property.pricePerMonth,
        //         deposit: property.securityDeposit,
        //         property: {
        //             connect: { id: propertyId },
        //         },
        //         tenant: {
        //             connect: { id: tenantId },
        //         },
        //     },
        // });

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
                // lease: {
                //     connect: { id: lease.id },
                // },
            },
            include: {
                property: true,
                tenant: true
                // lease: true,
            },
        });

        // return application;
        // });

        res.status(201).json({ success: true, error: "Application created" });

    } catch (error: any) {
        console.log(error.message)
        res
            .status(500)
            .json({ success: false, error: "Something went wrong. Try again" });
    }
};

export const updateApplicationStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log("status:", status);

        const application = await prisma.application.findUnique({
            where: { id: Number(id) },
            include: {
                property: true,
                tenant: true,
            },
        });

        if (!application) {
            res.status(404).json({ message: "Application not found." });
            return;
        }

        if (status === "Approved") {
            const newLease = await prisma.lease.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                    ),
                    rent: application.property.pricePerMonth,
                    deposit: application.property.securityDeposit,
                    propertyId: application.propertyId,
                    tenantId: application.tenantId,
                },
            });

            // Update the property to connect the tenant
            await prisma.property.update({
                where: { id: application.propertyId },
                data: {
                    tenants: {
                        connect: { id: application.tenantId },
                    },
                },
            });

            // Update the application with the new lease ID
            await prisma.application.update({
                where: { id: Number(id) },
                data: { status, leaseId: newLease.id },
                include: {
                    property: true,
                    tenant: true,
                    lease: true,
                },
            });
        } else {
            // Update the application status (for both "Denied" and other statuses)
            await prisma.application.update({
                where: { id: Number(id) },
                data: { status },
            });
        }

        // Respond with the updated application details
        const updatedApplication = await prisma.application.findUnique({
            where: { id: Number(id) },
            include: {
                property: true,
                tenant: true,
                lease: true,
            },
        });

        res.json(updatedApplication);
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error updating application status: ${error.message}` });
    }
};