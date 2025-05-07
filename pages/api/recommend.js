import { PrismaClient } from "@prisma/client"
import animeList from "../../data/animeCache.json" // adapter le chemin si besoin

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { mood, userId } = req.query

  if (!mood || !userId) {
    return res.status(400).json({ error: "Paramètres manquants" })
  }

  try {
    // ❌ Récupère les animes déjà vus
    const existing = await prisma.recommendation.findMany({
      where: { userId },
      select: { animeId: true }
    })

    const seenIds = new Set(existing.map(r => r.animeId))

    // 🧠 Filtrer les animes non vus
    const unseen = animeList.filter(anime => !seenIds.has(anime.mal_id))

    if (unseen.length === 0) {
      return res.status(200).json([])
    }

    // 🎯 Choisir 3 aléatoires
    const selected = unseen.sort(() => 0.5 - Math.random()).slice(0, 3)

    // 💾 Enregistrer en BDD
    await Promise.all(
      selected.map(anime =>
        prisma.recommendation.create({
          data: {
            animeId: anime.mal_id,
            title: anime.title,
            imageUrl: anime.images.jpg.image_url,
            mood,
            userId
          }
        })
      )
    )

    res.status(200).json(
      selected.map(anime => ({
        title: anime.title,
        imageUrl: anime.images.jpg.image_url,
        synopsis: anime.synopsis,
        malId: anime.mal_id
      }))
    )
  } catch (error) {
    console.error("Erreur recommandation cache:", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}
