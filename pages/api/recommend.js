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

  const { mood, userId } = req.query

if (!mood || typeof mood !== "string") {
  return res.status(400).json({ error: "Aucune humeur fournie" })
}

if (!userId || typeof userId !== "string") {
  return res.status(400).json({ error: "Utilisateur inconnu" })
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

    const selected = animeList.sort(() => 0.5 - Math.random()).slice(0, 3)

    await Promise.all(
      selected.map(async (anime) => {
        const exists = await prisma.recommendation.findFirst({
          where: {
            animeId: anime.mal_id,
            userId: userId,
          },
        })
    
        if (!exists) {
          await prisma.recommendation.create({
            data: {
              animeId: anime.mal_id,
              title: anime.title,
              imageUrl: anime.images.jpg.image_url,
              mood: mood,
              userId: userId,
            }
          })
        }
      })
    )
    

    res.status(200).json(
      selected.map(anime => ({
        title: anime.title,
        imageUrl: anime.images.jpg.image_url,
        synopsis: anime.synopsis,
        malId: anime.mal_id,
      }))
    )

  } catch (error) {
    console.error("Erreur API ou DB :", error)
    res.status(500).json({ error: "Erreur serveur" })
  }
}
