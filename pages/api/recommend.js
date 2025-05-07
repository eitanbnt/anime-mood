import { PrismaClient } from "@prisma/client"
import axios from "axios"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { mood, userId } = req.query

  if (!mood || !userId) {
    return res.status(400).json({ error: "Paramètres manquants" })
  }

  try {
    // 🧠 Requête multiple pages Jikan
    let allAnime = []

    for (let page = 1; page <= 4; page++) {
      console.log(`📡 Récupération de Jikan page ${page} pour humeur "${mood}"`)
      const response = await axios.get("https://api.jikan.moe/v4/anime", {
        params: {
          q: mood,
          limit: 25,
          page: page,
          order_by: "score",
          sort: "desc"
        }
      })

      const data = response.data.data
      allAnime.push(...data)
      await new Promise((r) => setTimeout(r, 1200)) // 1.1 sec pause
    }

    // ❌ Supprimer les déjà vus
    const existing = await prisma.recommendation.findMany({
      where: { userId },
      select: { animeId: true }
    })

    const seenIds = new Set(existing.map((r) => r.animeId))
    const unseenAnime = allAnime.filter((anime) => !seenIds.has(anime.mal_id))

    if (unseenAnime.length === 0) {
      return res.status(200).json([]) // rien de nouveau
    }

    // 🎯 Choisir 3 inédits aléatoires
    const selected = unseenAnime
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    // 💾 Enregistrer dans la BDD
    await Promise.all(
      selected.map((anime) =>
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
      selected.map((anime) => ({
        title: anime.title,
        imageUrl: anime.images.jpg.image_url,
        synopsis: anime.synopsis,
        malId: anime.mal_id
      }))
    )
  } catch (error) {
    console.error("Erreur recommandation :", error.message, error.response?.data)
    res.status(500).json({ error: "Erreur serveur" })
  }
}
