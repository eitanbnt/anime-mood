import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== "DELETE")
        return res.status(405).json({ error: "Méthode non autorisée" });

    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID manquant" });

    try {
        await prisma.recommendation.delete({ where: { id: Number(id) } });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Erreur suppression :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
