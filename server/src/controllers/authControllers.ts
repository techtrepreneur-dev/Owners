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

        if (checkUser) return res.status(409).json({ success: false, error: "User already exists" })

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

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await getUserByEmail(email)

        if (!user) return res.status(404).json({ success: false, error: "User not found" })

        const checkPassword = bcrypt.compareSync(password, user.password)

        if (!checkPassword) return res.status(401).json({ success: false, error: "Invalid password" })


        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" })

        res.status(201).json({ success: true, token, error: null })


    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: "Error please try again" })
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