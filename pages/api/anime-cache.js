import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
    try {
        const animes = await prisma.animeCache.findMany({
            orderBy: { id: "desc" },
            take: 12500,
        })
        res.status(200).json(animes)
    } catch (err) {
        console.error("❌ Erreur anime-cache :", err)
        res.status(500).json({ error: "Erreur serveur" })
    }
}
