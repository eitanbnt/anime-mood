import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { mood, userId } = req.query
  const cleanMood = decodeURIComponent(mood)

  if (!cleanMood || !userId) {
    return res.status(400).json({ error: "Paramètres manquants" })
  }

  try {
    // 🧠 Lire le cache depuis la base
    const animeList = await prisma.animeCache.findMany()

    // ❌ Récupérer les animes déjà vus
    const seen = await prisma.recommendation.findMany({
      where: { userId },
      select: { animeId: true },
    })

    const seenIds = new Set(seen.map((r) => r.animeId))
    const unseen = animeList.filter((a) => !seenIds.has(a.animeId))

    if (unseen.length === 0) {
      return res.status(200).json([])
    }

    const selected = unseen.sort(() => 0.5 - Math.random()).slice(0, 3)

    await Promise.all(
      selected.map((anime) =>
        prisma.recommendation.create({
          data: {
            animeId: anime.animeId,
            title: anime.title,
            titleEnglish: anime.titleEnglish || anime.title,
            imageUrl: anime.imageUrl,
            synopsis: anime.synopsis,
            mood: cleanMood,
            userId,
          },
        })
      )
    )

    res.status(200).json(selected)
  } catch (error) {
    console.error("Erreur recommandation :", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}
