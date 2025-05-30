import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
    const { userId } = req.query

    if (!userId) {
        return res.status(400).json({ error: "userId requis" })
    }

    try {
        const seenList = await prisma.animeSeen.findMany({
            where: { userId },
            select: { animeId: true }
        })

        const recs = await prisma.recommendation.findMany({
            where: {
                userId,
                animeId: { in: seenList.map(s => s.animeId) }
            },
            orderBy: { createdAt: "desc" }
        })

        res.status(200).json(recs)
    } catch (err) {
        console.error("Erreur dans /api/seen-list:", err)
        res.status(500).json({ error: "Erreur serveur", details: err.message })
    }
}
