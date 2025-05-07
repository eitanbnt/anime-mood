import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ error: "Méthode non autorisée" })
    }

    const { id, isFavorite } = req.body

    if (!id || typeof isFavorite !== "boolean") {
        return res.status(400).json({ error: "ID ou valeur invalide" })
    }

    try {
        await prisma.recommendation.update({
            where: { id: parseInt(id) },
            data: { isFavorite },
        })

        res.status(200).json({ success: true })
    } catch (error) {
        console.error("Erreur favoris :", error)
        res.status(500).json({ error: "Erreur serveur" })
    }
}
