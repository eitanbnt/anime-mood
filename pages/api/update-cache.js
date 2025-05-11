// pages/api/update-cache.js

import { PrismaClient } from "@prisma/client"
import axios from "axios"

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" })
    }

    let all = []

    for (let page = 1; page <= 800; page++) {
        try {
            const response = await axios.get("https://api.jikan.moe/v4/anime", {
                params: {
                    limit: 25,
                    page,
                    order_by: "score",
                    sort: "desc",
                },
            })

            const list = response.data.data.map((a) => ({
                animeId: a.mal_id,
                title: a.title,
                titleEnglish: a.title_english,
                imageUrl: a.images?.jpg?.image_url || "",
                synopsis: a.synopsis || "",
            }))

            all.push(...list)

            // ⏱️ Respect du rate-limit de Jikan : 2s entre chaque page
            await new Promise((r) => setTimeout(r, 2100))
        } catch (err) {
            console.error("❌ Erreur à la page", page, err.message)
            break
        }
    }

    try {
        await prisma.animeCache.deleteMany()
        await prisma.animeCache.createMany({ data: all, skipDuplicates: true })

        res.status(200).json({ success: true, count: all.length })
    } catch (e) {
        console.error("❌ Erreur en base :", e)
        res.status(500).json({ error: "Erreur serveur lors de l'enregistrement" })
    }
}
