import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Méthode non autorisée' })
    }

    const { id, note } = req.body

    if (!id || typeof note !== 'string') {
        return res.status(400).json({ error: 'ID ou note invalide' })
    }

    try {
        await prisma.recommendation.update({
            where: { id: parseInt(id) },
            data: { note },
        })

        res.status(200).json({ success: true })
    } catch (err) {
        console.error('Erreur mise à jour note :', err)
        res.status(500).json({ error: 'Erreur serveur' })
    }
}
