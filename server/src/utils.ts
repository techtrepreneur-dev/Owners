import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function getUserByEmail(email: string) {

    const checkTenant = await prisma.tenant.findUnique({
        where: {
            email: email
        }
    })
    const checkManager = await prisma.manager.findUnique({
        where: {
            email: email
        }
    })

    if (checkManager) return checkManager
    if (checkTenant) return checkTenant
    return null
}