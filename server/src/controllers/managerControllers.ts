import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.userId
        const manager = await prisma.manager.findUnique({
            where: { id },
        });

        if (manager) {
            res.status(201).json(manager);
        } else {
            res.status(404).json({ message: "Manager not found" });
        }
    } catch (error: any) {
        res
            .status(500)
            .json({ message: `Error retrieving manager: ${error.message}` });
    }
};

export const updateManager = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.userId
        const data = req.body;

        const tenant = await prisma.manager.update({
            where: { id: id },
            data: data,
        });

        res.status(201).json({ success: true, error: null })

    } catch (error: any) {
        console.log(error)
        res.status(500).json({ success: false, error: error.message })
    }
};


export const getManagerProperties = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {

        const id = req.userId
        const properties = await prisma.property.findMany({
            where: { managerId: id },
            include: {
                location: true,
            },
        });

        const propertiesWithFormattedLocation = await Promise.all(
            properties.map(async (property) => {
                const coordinates: { coordinates: string }[] =
                    await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id = ${property.location.id}`;

                const geoJSON: any = wktToGeoJSON(coordinates[0]?.coordinates || "");
                const longitude = geoJSON.coordinates[0];
                const latitude = geoJSON.coordinates[1];

                return {
                    ...property,
                    location: {
                        ...property.location,
                        coordinates: {
                            longitude,
                            latitude,
                        },
                    },
                };
            })
        );

        res.status(200).json({ success: true, data: propertiesWithFormattedLocation, error: null });
    } catch (err: any) {
        res
            .status(500)
            .json({ success: false, error: "Error getting manager properties" });
    }
};
