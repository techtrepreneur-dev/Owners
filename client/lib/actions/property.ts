"use server"

import z from "zod"
import { propertyValidation } from "../validations"
import { cookies } from 'next/headers';
import { Property, Tenant } from "../types/prismaTypes";
import { GoogleGenerativeAI } from "@google/generative-ai";

// AI generate suggestion base on image selected
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");


export type ActionState = {
    success: boolean;
    data: Tenant,
    error: string | null;
    fieldErrors: Record<string, string[]> | null;
};
export const createProperty = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {

    try {
        const images = formData.getAll("photoUrls").filter((item) => item.name !== "undefined")
        console.log(images)
        const formValues = {
            name: formData.get("name"),
            description: formData.get("description"),
            pricePerMonth: formData.get("pricePerMonth"),
            otherFees: formData.get("otherFees"),
            applicationFee: formData.get("applicationFee"),
            photoUrls: images,
            amenities: formData.getAll("amenities"),
            highlights: formData.getAll("highlights"),
            beds: formData.get("beds"),
            baths: formData.get("baths"),
            squareFeet: formData.get("squareFeet"),

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
        uploadFormData.append('otherFees', String(validatedData.otherFees));
        uploadFormData.append('totalFee', String(formData.get("totalFee")));
        uploadFormData.append('applicationFee', String(validatedData.applicationFee));
        uploadFormData.append('isPetsAllowed', String(formData.get("isPetsAllowed")));
        uploadFormData.append('isParkingIncluded', String(formData.get("isParkingIncluded")));
        validatedData.photoUrls?.forEach((file) => {
            uploadFormData.append("photoUrls", file); // Multiple files
        });
        uploadFormData.append('propertyType', String(formData.get("propertyType")));
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


export async function AiGenerateDescriptionSuggestions(formData: FormData) {
    try {
        const name = formData.get("name") as string;

        // getAll retrieves an array of all files appended under the "images" key
        const files = formData.getAll("images") as File[];

        const prompt = `Using the initial name and images of properties provided,
        generate a better name suggestion using parts of the initial name provided for the property. Images might include both the interiors(kitchen, bathrooms, e.t.c) and exteriors 
        of the property, so pay detailed attention.  Also generate a description of two
        paragraphs long for the property by analyzing the images provided. Return the result in json format like this
        {
         name:,
         descrition:,
        }`

        // 1. Start the parts array with the main text prompt
        const parts: any[] = [
            { text: prompt },
            { text: name }
        ];

        // 2. Loop through every uploaded image and format it for Gemini
        for (const file of files) {
            if (file && file.size > 0) {
                const arrayBuffer = await file.arrayBuffer();
                const base64Data = Buffer.from(arrayBuffer).toString("base64");

                parts.push({
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type, // handles mixed formats (e.g., png and jpeg together)
                    },
                });
            }
        }

        // 3. Send the entire multimodal payload to Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: parts,
                },
            ],
        });
        const returnText = result.response.text()
        const cleanedText = returnText.replace(/```(?:json)?\n?/g, "").trim()

        const data = JSON.parse(cleanedText);
        return { success: true, data, error: null };

    } catch (error) {
        console.error("Server Action Gemini Error:", error);
        return { success: false, error: "Something went wrong on the server." }
    }
}
