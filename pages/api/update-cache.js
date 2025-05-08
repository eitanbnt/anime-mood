import { PrismaClient } from "@prisma/client"
import axios from "axios"

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" })
    }

    let all = []

    for (let page = 1; page <= 20; page++) {
        try {
            const res = await axios.get("https://api.jikan.moe/v4/anime", {
                params: {
                    limit: 25,
                    page,
                    order_by: "score",
                    sort: "desc"
                }
            })

            const list = res.data.data.map((a) => ({
                animeId: a.mal_id,
                title: a.title,
                imageUrl: a.images.jpg.image_url,
                synopsis: a.synopsis
            }))

            all.push(...list)

            await new Promise((r) => setTimeout(r, 1100))
        } catch (err) {
            console.error("Erreur à la page", page, err.message)
            break
        }
    }

    // Remplace tout le cache
    await prisma.animeCache.deleteMany()
    await prisma.animeCache.createMany({ data: all, skipDuplicates: true })

    res.status(200).json({ success: true, count: all.length })
}
