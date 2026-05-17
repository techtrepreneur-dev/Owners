import { z } from "zod";

export const signUpValidation = z
    .object({
        firstName: z
            .string()
            .min(3, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters"),
        lastName: z
            .string()
            .min(3, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters"),

        email: z.string()
            .min(12, "Must be at least 12 characters. ")
            .max(50, "Must not exceed 50 characters. ")
            .regex(/^[a-zA-Z0-9@.]+$/, "Only numbers, letters, and @ are allowed"),

        phone: z
            .string()
            .min(10, "Phone number must be at least 10 digits ")
            .regex(/^([+]?[\s0-9]+)?(\d{3,4})?[\-\.\s]?\d{3}[\-\.\s]?\d{4,6}$/, "Invalid phone number"),

        state: z
            .string()
            .min(3, "State must be at least 2 characters")
            .max(50, "State must be less than 50 characters"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),

        confirmPassword: z.string(), // Define the field first

        role: z.enum(["tenant", "manager"], {
            error_map: () => ({ message: "Please select either 'tenant' or 'manager'" }),
        }),
    })
    // Use .refine to compare the two fields
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // This ensures the error is attached to the confirmPassword field
    });

export const signInValidation = z
    .object({

        email: z.string()
            .min(12, "Must be at least 12 characters. ")
            .max(50, "Must not exceed 50 characters. ")
            .regex(/^[a-zA-Z0-9@.]+$/, "Only numbers, letters, and @ are allowed"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
    })

export const resendEmailValidation = z
    .object({
        email: z.string()
            .min(12, "Must be at least 12 characters. ")
            .max(50, "Must not exceed 50 characters. ")
            .regex(/^[a-zA-Z0-9@.]+$/, "Only numbers, letters, and @ are allowed")
    })

export const verifyPasswordOTP = z
    .object({
        otp: z
            .string()
            .max(6, "OTP must not be more than six digits. ")
    })


export const changePasswordValidation = z
    .object({

        email: z.string()
            .min(12, "Must be at least 12 characters. ")
            .max(50, "Must not exceed 50 characters. ")
            .regex(/^[a-zA-Z0-9@.]+$/, "Only numbers, letters, and @ are allowed"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),

        confirmPassword: z.string(), // Define the field first
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // This ensures the error is attached to the confirmPassword field
    });



export const updateUserValidation = z
    .object({

        name: z
            .string()
            .min(3, "Name must be at least 2 characters")
            .max(50, "Name must be less than 50 characters"),

        email: z.string()
            .min(12, "Must be at least 12 characters. ")
            .max(50, "Must not exceed 50 characters. ")
            .regex(/^[a-zA-Z0-9@.]+$/, "Only numbers, letters, and @ are allowed"),

        phone: z
            .string()
            .min(10, "Phone number must be at least 10 digits ")
            .regex(/^([+]?[\s0-9]+)?(\d{3,4})?[\-\.\s]?\d{3}[\-\.\s]?\d{4,6}$/, "Invalid phone number"),

    })


const imageSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "Each file must not exceed 5MB",
    })
    .refine(
        (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
        { message: "Only JPEG, PNG, or GIF files are allowed" }
    );

export const propertyValidation = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    pricePerMonth: z.coerce.number().min(100, { message: "Value should not be less that 100 Naira" }).int(),
    securityDeposit: z.coerce.number().min(100, { message: "Value should not be less that 100 Naira" }).int(),
    applicationFee: z.coerce.number().min(100, { message: "Value should not be less that 100 Naira" }).int(),
    // isPetsAllowed: z.boolean(),
    // isParkingIncluded: z.boolean(),
    photoUrls: z
        .array(imageSchema)
        .min(1, { message: "Atleast one image is required" })
        .max(10, { message: "You cannot upload more than 10 images" }),
    amenities: z.array(z.string()).optional(),
    highlights: z.array(z.string()).optional(),
    beds: z.coerce.number().min(0).max(10).int().optional(),
    baths: z.coerce.number().min(0).max(10).int().optional(),
    squareFeet: z.coerce.number().min(0).int().optional(),
    //   propertyType: z.nativeEnum(PropertyTypeEnum),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
});

export const applicationValidation = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    message: z.string().optional(),
});