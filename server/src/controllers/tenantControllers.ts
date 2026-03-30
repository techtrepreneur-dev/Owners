import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getUserByEmail } from "../utils.js";
// import { wktToGeoJSON } from "@terraformer/wkt";

const prisma = new PrismaClient();

export const getTenant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: { id: Number(id) },
            include: {
                favorites: true,
            },
        });

        if (tenant) {
            res.status(200).json({ success: true, data: tenant, error: null })
        } else {
            res.status(404).json({ success: true, data: [], error: "No user found" })
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ success: true, error: "Something went wrong" })
    }
};


// export const updateTenant = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const id = req.userId
//         const data = req.body;

//         const tenant = await prisma.tenant.update({
//             where: { id: id },
//             data: data,
//         });

//         res.status(201).json({ success: true, error: null })

//     } catch (error: any) {
//         console.log(error)
//         res.status(500).json({ success: false, error: error.message })
//     }
// };


export const getCurrentResidences = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const id = req.userId
        const properties = await prisma.property.findMany({
            where: { tenants: { some: { id } } },
            include: {
                location: true,
            },
        });

        const residencesWithFormattedLocation = await Promise.all(
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

        res.json(residencesWithFormattedLocation);
    } catch (err: any) {
        res
            .status(500)
            .json({ message: `Error retrieving manager properties: ${err.message}` });
    }
};

export const addFavoriteProperty = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id, propertyId } = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: { id: Number(id) },
            include: { favorites: true },
        });

        if (!tenant) {
            res.status(404).json({ success: false, data: null, error: "Tenant not found" });
            return;
        }

        const propertyIdNumber = Number(propertyId);
        const existingFavorites = tenant.favorites || [];

        if (!existingFavorites.some((fav) => fav.id === propertyIdNumber)) {
            const updatedTenant = await prisma.tenant.update({
                where: { id: Number(id) },
                data: {
                    favorites: {
                        connect: { id: propertyIdNumber },
                    },
                },
                include: { favorites: true },
            });

            res.status(201).json({ success: true, data: updatedTenant, error: null });
        }
        else {
            res.status(409).json({ success: false, data: null, error: "Property already in favourites" });
        }
    }
    catch (error: any) {
        console.log(error)
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};

export const removeFavoriteProperty = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id, propertyId } = req.params;
        const propertyIdNumber = Number(propertyId);

        const updatedTenant = await prisma.tenant.update({
            where: { id: Number(id) },
            data: {
                favorites: {
                    disconnect: { id: propertyIdNumber },
                },
            },
            include: { favorites: true },
        });

        res.status(200).json({ success: true, data: updatedTenant, error: null });
    }
    catch (error: any) {
        console.log(error)
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
};