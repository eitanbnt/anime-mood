import axios from 'axios'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const moodToQuery = {
  Heureux: "slice of life",
  Triste: "drama",
  Nostalgique: "romance",
  Énergique: "sports",
  Amoureux: "shoujo",
}

export default async function handler(req, res) {
  const { mood } = req.query

  if (!mood || typeof mood !== "string") {
    return res.status(400).json({ error: "Aucune humeur fournie" })
  }

  const query = moodToQuery[mood] || "drama"

  try {
    const response = await axios.get("https://api.jikan.moe/v4/anime", {
      params: {
        q: query,
        limit: 15,
        order_by: "score",
        sort: "desc"
      }
    })

    const animeList = response.data.data

    if (!animeList || animeList.length === 0) {
      return res.status(404).json({ error: "Aucun anime trouvé" })
    }

    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)]

    await prisma.recommendation.create({
      data: {
        animeId: randomAnime.mal_id,
        title: randomAnime.title,
        imageUrl: randomAnime.images.jpg.image_url,
        mood: mood,
      }
    })

    res.status(200).json({
      title: randomAnime.title,
      imageUrl: randomAnime.images.jpg.image_url,
      synopsis: randomAnime.synopsis,
      malId: randomAnime.mal_id,
    })

  } catch (error) {
    console.error("Erreur API ou DB :", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}
