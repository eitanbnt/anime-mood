import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
    const { userId } = req.query

    if (!userId) {
        return res.status(400).json({ error: "userId manquant" })
    }

    try {
        const favorites = await prisma.recommendation.findMany({
            where: { userId, isFavorite: true },
            orderBy: { createdAt: "desc" },
        })

        res.status(200).json(favorites)
    } catch (err) {
        console.error("Erreur /api/favorites :", err)
        res.status(500).json({ error: "Erreur serveur" })
    }
}
