// pages/api/update-cache.js

import { PrismaClient } from "@prisma/client"
import axios from "axios"

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" })
    }

    let all = []

    for (let page = 1; page <= 2; page++) {
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
                trailer: a.trailer?.url || "",
                source: a.source || "",
                episodes: a.episodes?.toString() || "",
                score: a.score?.toString() || "",
                genres: (a.genres || []).map((g) => g.name),
            }))

            all.push(...list)
            await new Promise((r) => setTimeout(r, 2100))
        } catch (err) {
            console.error("❌ Erreur à la page", page, err.message)
            break
        }
    }

    try {
        // 🌀 Upsert genre + anime
        for (const anime of all) {
            // 🔁 Upsert chaque genre
            for (const name of anime.genres) {
                await prisma.genre.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                })
            }

            await prisma.animeCache.upsert({
                where: { animeId: anime.animeId },
                update: {
                    title: anime.title,
                    titleEnglish: anime.titleEnglish,
                    imageUrl: anime.imageUrl,
                    synopsis: anime.synopsis,
                    trailer: anime.trailer,
                    source: anime.source,
                    episodes: anime.episodes,
                    score: anime.score,
                    genres: {
                        set: [], // on réinitialise les anciennes relations
                        connect: anime.genres.map((name) => ({ name })),
                    },
                },
                create: {
                    animeId: anime.animeId,
                    title: anime.title,
                    titleEnglish: anime.titleEnglish,
                    imageUrl: anime.imageUrl,
                    synopsis: anime.synopsis,
                    trailer: anime.trailer,
                    source: anime.source,
                    episodes: anime.episodes,
                    score: anime.score,
                    genres: {
                        connect: anime.genres.map((name) => ({ name })),
                    },
                },
            })
        }

        res.status(200).json({ success: true, count: all.length })
    } catch (e) {
        console.error("❌ Erreur en base :", e)
        res
            .status(500)
            .json({ error: "Erreur serveur lors de l'enregistrement" })
    }
}
