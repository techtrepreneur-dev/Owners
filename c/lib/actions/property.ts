"use server"

import z from "zod"
import { propertyValidation } from "../validations"
import { cookies } from 'next/headers';
import { Property, Tenant } from "../types/prismaTypes";

export type ActionState = {
    success: boolean;
    data: Tenant,
    error: string | null;
    fieldErrors: Record<string, string[]> | null;
};
export const createProperty = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const images = formData.getAll("photoUrls").filter((item) => item.name !== "undefined")
        const formValues = {
            name: formData.get("name"),
            description: formData.get("description"),
            pricePerMonth: formData.get("pricePerMonth"),
            securityDeposit: formData.get("securityDeposit"),
            applicationFee: formData.get("applicationFee"),
            // isPetsAllowed: formData.get("isPetsAllowed"),
            // isParkingIncluded: formData.get("isParkingIncluded"),
            photoUrls: images,
            amenities: formData.getAll("amenities"),
            highlights: formData.getAll("highlights"),
            beds: formData.get("beds"),
            baths: formData.get("baths"),
            squareFeet: formData.get("squareFeet"),

            //   propertyType: z.nativeEnum(PropertyTypeEnum)
            address: formData.get("address"),
            city: formData.get("city"),
            state: formData.get("state"),
            country: formData.get("country"),
            postalCode: formData.get("postalCode")
        }

        // console.log(formValues)
        const validatedData = await propertyValidation.parseAsync(formValues)

        const uploadFormData = new FormData();

        uploadFormData.append('managerId', String(formData.get("managerId")));
        uploadFormData.append('name', validatedData.name);
        uploadFormData.append('description', validatedData.description);
        uploadFormData.append('pricePerMonth', String(validatedData.pricePerMonth));
        uploadFormData.append('securityDeposit', String(validatedData.securityDeposit));
        uploadFormData.append('applicationFee', String(validatedData.applicationFee));
        uploadFormData.append('isPetsAllowed', String(formData.get("isPetsAllowed")));
        uploadFormData.append('isParkingIncluded', String(formData.get("isParkingIncluded")));
        validatedData.photoUrls?.forEach((file) => {
            uploadFormData.append("photoUrls", file); // Multiple files
        });
        uploadFormData.append('propertyType', "Tinyhouse");
        uploadFormData.append('amenities', JSON.stringify(validatedData.amenities));
        uploadFormData.append('highlights', JSON.stringify(validatedData.highlights));
        uploadFormData.append('beds', String(validatedData.beds));
        uploadFormData.append('baths', String(validatedData.baths));
        uploadFormData.append('squareFeet', String(validatedData.squareFeet));

        uploadFormData.append('address', validatedData.address);
        uploadFormData.append('city', validatedData.city);
        uploadFormData.append('state', validatedData.state);
        uploadFormData.append('country', validatedData.country);
        uploadFormData.append('postalCode', validatedData.postalCode);


        const cookieStore = await cookies();
        const token = cookieStore.get('session-token');

        const res = await fetch(`${process.env.API_BASE_URL}/properties`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token?.value}`
            },
            body: uploadFormData
        })

        if (res.status !== 201) {
            console.log(res)
        }

        const resData: Promise<{ success: boolean, data: Tenant, error: string | null }> = res.json()
        const data = await resData

        if (!data.success) {
            return { success: false, data: null, error: data.error, fieldErrors: null }
        }

        return { success: true, data: data.data, error: null, fieldErrors: null }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.flatten().fieldErrors
            return { success: false, data: null, error: null, fieldErrors }
        }
        else {
            console.log(error)
            throw new Error("Something went wrong")
        }
    }
}

export const getProperties = async (filters) => {
    // console.log(filters)

    const params = {
        location: filters.location,
        priceMin: filters.priceRange?.[0],
        priceMax: filters.priceRange?.[1],
        beds: filters.beds,
        baths: filters.baths,
        propertyType: filters.propertyType,
        squareFeetMin: filters.squareFeet?.[0],
        squareFeetMax: filters.squareFeet?.[1],
        amenities: filters.amenities?.join(","),
        availableFrom: filters.availableFrom,
        favoriteIds: filters.favoriteIds?.join(","),
        latitude: filters.coordinates?.[1],
        longitude: filters.coordinates?.[0],
    }
    const updatedSearchParams = new URLSearchParams();


    Object.entries(params).forEach(([key, value]) => {
        if (value != undefined || value != null) {
            updatedSearchParams.set(
                key,
                Array.isArray(value) ? value.join(",") : value
            );
        }
    });


    const queryString = updatedSearchParams.toString()

    const res = await fetch(`${process.env.API_BASE_URL}/properties?${queryString}`)

    if (res.status !== 200) {
        console.log(res)
    }

    const resData: Promise<{ success: boolean, data: Property[], error: string | null }> = res.json()
    const data = await resData


    if (!data.success) {
        return { success: false, data: null, error: data.error }
    }

    return { success: true, data: data.data, error: null }
}

export const getProperty = async (id: number) => {
    const res = await fetch(`${process.env.API_BASE_URL}/properties/${id}`)

    if (res.status !== 200) {
        console.log(res)
    }

    const resData: Promise<{ success: boolean, data: Property, error: string | null }> = res.json()
    const data = await resData

    // console.log(data.data)
    if (!data.success) {
        return { success: false, data: null, error: data.error }
    }

    return { success: true, data: data.data, error: null }
}