import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export default async function handler(req, res) {
    try {
        // 📥 On récupère toutes les recommandations
        const latest = await prisma.recommendation.findMany({
            orderBy: { createdAt: "desc" }
        })

        // 📥 On récupère tous les genres depuis le cache
        const allCache = await prisma.animeCache.findMany()
        const genreMap = new Map(allCache.map(a => [a.animeId, a.genres || ""]))

        const seenIds = new Set()
        const entries = []

        for (const rec of latest) {
            if (seenIds.has(rec.animeId)) continue
            seenIds.add(rec.animeId)

            if (!rec.animeId || !rec.title || !rec.imageUrl || !rec.mood) {
                console.warn("⛔ Incomplet, ignoré :", rec)
                continue
            }

            entries.push({
                animeId: rec.animeId,
                title: rec.title,
                titleEnglish: rec.titleEnglish || rec.title,
                imageUrl: rec.imageUrl,
                synopsis: rec.synopsis || "",
                genres: genreMap.get(rec.animeId) || "",
                mood: rec.mood
            })
        }

        await prisma.moodCache.deleteMany()
        await prisma.moodCache.createMany({ data: entries, skipDuplicates: true })

        res.status(200).json({ success: true, count: entries.length })
    } catch (err) {
        console.error("❌ Erreur build-mood-cache :", err)
        res.status(500).json({ error: "Erreur serveur" })
    }
}
