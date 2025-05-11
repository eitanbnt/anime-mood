import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
    try {
        await prisma.animeCache.deleteMany()
        await prisma.moodCache.deleteMany()
        res.status(200).json({ success: true })
    } catch (err) {
        console.error("❌ clear-cache error:", err)
        res.status(500).json({ error: "Erreur serveur" })
    }
}
