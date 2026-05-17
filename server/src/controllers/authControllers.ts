import type { Request, Response } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
import { getUserByEmail } from "../utils.js";

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
    const data = req.body

    try {
        const checkUser = await getUserByEmail(data.email)

        if (checkUser) return res.status(409).json({ success: false, error: "User already exists. Login instead" })

        const hashedPasword = bcrypt.hashSync(data.password, 8)

        let user;

        if (data.role === "tenant") {
            user = await prisma.tenant.create({
                data: { ...data, password: hashedPasword }
            })
        }

        if (data.role === "manager") {
            user = await prisma.manager.create({
                data: { ...data, password: hashedPasword }
            })
        }


        if (!user) {
            return res.status(500).json({ success: false, error: "Unable to save user details" })
        }


        res.status(201).json({ success: true, error: null })


    } catch (error: any) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error please try again" })
    }
}

export const manualSignIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await getUserByEmail(email)

        if (!user) return res.status(404).json({ success: false, error: "Invalid email: User not found" })

        const checkPassword = bcrypt.compareSync(password, user.password)

        if (!checkPassword) return res.status(401).json({ success: false, error: "Invalid password" })

        if (!user.emailVerified) return res.status(401).json({ success: false, error: "Email not verified" })


        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" })

        res.status(200).json({ success: true, token, error: null })


    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error please try again" })
    }
}

export const GoogleSignIn = async (req: Request, res: Response) => {
    const { email } = req.body

    try {
        const user = await getUserByEmail(email)

        if (!user) return res.status(404).json({ success: false, error: "Invalid email: Trying using the email used for sign up" })

        if (!user.emailVerified) return res.status(401).json({ success: false, error: "Email not verified" })

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" })

        res.status(200).json({ success: true, token, error: null })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error: please try again" })
    }
}

export const getAuthUser = async (req: Request, res: Response) => {
    const data = req.body

    try {
        const user = await getUserByEmail(data.email)

        if (user) return res.status(200).json({ success: true, data: user, error: null })

        if (!user) return res.status(403).json({ success: false, data: null, error: "User not authenticated" })


    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error please try again" })
    }
}

export const saveEmailVerificationLinkToken = async (req: Request, res: Response) => {
    const { email, token, expiresAt } = req.body

    try {

        await prisma.verificationCode.deleteMany({
            where: { email }
        });

        const result = await prisma.verificationCode.create({
            data: { email, token, expiresAt }
        });
        res.status(201).json({ success: true, error: null })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error please try again: Unable to save code" })
    }
}

export const verifyEmailVerificationToken = async (req: Request, res: Response) => {
    const { email, token, } = req.body

    try {
        const result = await prisma.verificationCode.findUnique({
            where: {
                email: email
            }
        })

        if (!result) return res.status(404).json({ success: false, error: "Invalid User" })

        if (result.token != token) return res.status(403).json({ success: false, error: "Invalid User token" })

        const dbDate = new Date(result.expiresAt);
        if (dbDate.getTime() < Date.now()) return res.status(403).json({ success: false, error: "Token expired" })


        const getUser = await getUserByEmail(email)

        const updateUser = await prisma.$transaction(async (tx) => {

            if (getUser.role == "tenant") {
                await tx.tenant.update({
                    where: { email: email },
                    data: { emailVerified: true }
                })
            }
            if (getUser.role == "manager") {
                await tx.manager.update({
                    where: { email: email },
                    data: { emailVerified: true }
                })
            }
            return await tx.verificationCode.delete({
                where: { email: email }
            })
        })

        if (!updateUser) return res.status(500).json({ success: false, error: "User update error. Please try again" })

        res.status(200).json({ success: true, error: null })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error! Please try again. Unable verify code" })
    }
}

export const saveForgetPasswordToken = async (req: Request, res: Response) => {
    const { email, token, expiresAt } = req.body

    try {

        await prisma.verificationCode.deleteMany({
            where: { email }
        });

        const result = await prisma.verificationCode.create({
            data: { email, token, expiresAt }
        });
        res.status(201).json({ success: true, error: null })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error please try again: Unable to save code" })
    }
}

export const verifyForgetPasswordToken = async (req: Request, res: Response) => {
    const { token } = req.body

    try {
        const result = await prisma.verificationCode.findFirst({
            where: {
                token: token
            }
        })

        if (!result) return res.status(404).json({ success: false, error: "Invalid OTP" })

        const dbDate = new Date(result.expiresAt);
        if (dbDate.getTime() < Date.now()) return res.status(403).json({ success: false, error: "OTP expired" })


        const deleteToken = await prisma.verificationCode.deleteMany({
            where: { token: token }
        })

        if (!deleteToken) return res.status(500).json({ success: false, error: "User token delete error. Please try again" })

        res.status(200).json({ success: true, error: null })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error! Please try again. Unable verify code" })
    }
}


export const changePassword = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const checkUser = await getUserByEmail(email)

        if (!checkUser) return res.status(404).json({ success: false, error: "Invalid email: User not found" })

        const hashedPasword = bcrypt.hashSync(password, 8)

        let user;

        if (checkUser.role === "tenant") {
            user = await prisma.tenant.update({
                where: { email },
                data: { password: hashedPasword }
            })
        }

        if (checkUser.role === "manager") {
            user = await prisma.manager.update({
                where: { email },
                data: { password: hashedPasword }
            })
        }
        if (!user) {
            return res.status(500).json({ success: false, error: "Unable to save password: Try again" })
        }

        res.status(201).json({ success: true, error: null })


    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error please try again" })
    }
}