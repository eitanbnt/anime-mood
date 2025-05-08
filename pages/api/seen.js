import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end()

    const { animeId, userId } = req.body
    if (!animeId || !userId) {
        return res.status(400).json({ error: "animeId ou userId manquant" })
    }

    try {
        console.log("Ajout AnimeSeen:", animeId, userId)
        await prisma.animeSeen.create({
            data: { animeId, userId }
        })
        res.status(200).json({ success: true })
    } catch (err) {
        console.error("Erreur /api/seen:", err)
        if (err.code === "P2002") {
            res.status(200).json({ success: true, message: "Déjà vu" })
        } else {
            res.status(500).json({ error: "Erreur serveur", details: err })
        }
    }
}
