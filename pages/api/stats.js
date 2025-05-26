import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId manquant" });

    try {
        const [recommendations, favorites, seen] = await Promise.all([
            prisma.recommendation.findMany({ where: { userId } }),
            prisma.recommendation.findMany({
                where: { userId, isFavorite: true },
            }),
            prisma.animeSeen.findMany({ where: { userId } }),
        ]);

        const moodCount = {};
        for (const rec of recommendations) {
            const m = rec.mood || "Inconnu";
            moodCount[m] = (moodCount[m] || 0) + 1;
        }

        res.status(200).json({
            total: recommendations.length,
            favorites: favorites.length,
            seen: seen.length,
            moods: moodCount,
        });
    } catch (err) {
        console.error("Erreur /api/stats:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
