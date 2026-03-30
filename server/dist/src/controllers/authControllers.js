import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const signup = async (req, res) => {
    const data = req.body;
    const hashedPasword = bcrypt.hashSync(data.password, 8);
    try {
        const user = await prisma.tenant.create({
            data: { ...data, password: hashedPasword }
        });
        if (!user)
            return res.status(500).json({ success: false, error: "Unable to save user details" });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", { expiresIn: "24h" });
        res.status(201).json({ success: false, error: null });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Error please try again" });
    }
};
export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user)
            return res.status(404).json({ success: false, error: "User not found" });
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (!checkPassword)
            return res.status(401).json({ success: false, error: "Invalid password" });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        console.log(token);
        res.status(201).json({ token });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Error please try again" });
    }
};
//# sourceMappingURL=authControllers.js.map