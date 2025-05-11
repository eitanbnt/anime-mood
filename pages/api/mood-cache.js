import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        const data = await prisma.moodCache.findMany();
        res.status(200).json(data);
    } catch (err) {
        console.error("Erreur mood cache :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
