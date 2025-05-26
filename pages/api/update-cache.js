import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

// Dictionnaire pour associer les genres aux moods
const genreToMood = {
    "Adventure": ["heureux", "énergique", "feel-good"],
    "Drama": ["triste", "nostalgique", "calme"],
    "Fantasy": ["heureux", "énergique", "mind-blowing", "amoureux"],
    "Action": ["énergique", "mind-blowing", "heureux"],
    "Sci-Fi": ["mind-blowing", "énergique", "nostalgique", "calme"],
    "Suspense": ["mind-blowing", "triste", "calme"],
    "Comedy": ["heureux", "délirant", "feel-good", "calme"],
    "Supernatural": ["mind-blowing", "heureux", "calme"],
    "Romance": ["amoureux", "heureux", "calme"],
    "Award Winning": ["nostalgique", "calme", "triste"],
    "Mystery": ["mind-blowing", "triste", "calme"],
    "Sports": ["énergique", "heureux", "feel-good"],
    "Slice of Life": ["calme", "amoureux", "triste"],
    "Ecchi": ["amoureux", "délirant"],
    "Gourmet": ["calme", "heureux", "feel-good"],
    "Horror": ["triste", "mind-blowing", "à pleurer"],
    "Avant Garde": ["mind-blowing", "nostalgique", "calme"],
    "Boys Love": ["amoureux", "calme"],
    "Hentai": ["amoureux", "délirant"],
    "Girls Love": ["amoureux", "calme"],
    "Erotica": ["amoureux", "calme"]
}

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Méthode non autorisée" });

    let all = [];

    for (let page = 1; page <= 100; page++) {
        try {
            const { data } = await axios.get("https://api.jikan.moe/v4/anime", {
                params: { limit: 25, page, order_by: "score", sort: "desc" },
            });

            const chunk = data.data.map((a) => {
                const genres = a.genres || [];
                const moods = genres.flatMap((g) => genreToMood[g.name] || []);
                return {
                    animeId: a.mal_id,
                    title: a.title,
                    titleEnglish: a.title_english,
                    imageUrl: a.images?.jpg?.image_url || "",
                    synopsis: a.synopsis || "",
                    trailer: a.trailer?.url || "",
                    source: a.source || "",
                    episodes: a.episodes?.toString() || "",
                    score: a.score?.toString() || "",
                    genres: genres.map((g) => g.name),
                    moods,
                };
            });

            all.push(...chunk);
            await new Promise((r) => setTimeout(r, 2500));
        } catch (err) {
            console.error("❌ Erreur à la page", page, err.message);
            break;
        }
    }

    try {
        for (const anime of all) {
            // genres
            for (const name of anime.genres) {
                await prisma.genre.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                });
            }

            // AnimeCache
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
                        set: [],
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
            });

            // MoodCache (une seule ligne par anime)
            await prisma.moodCache.upsert({
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
                },
            });

            // Mood (un seul mood par anime, on garde le premier s’il y en a plusieurs)
            const moodValue = anime.moods[0];
            if (moodValue) {
                await prisma.mood.createMany({
                    data: anime.moods.map(m => ({ animeId: anime.animeId, mood: m })),
                    skipDuplicates: true          // si la paire (animeId, mood) existe déjà
                });
            }
        }

        res.status(200).json({ success: true, count: all.length });
    } catch (e) {
        console.error("❌ Erreur en base :", e);
        res
            .status(500)
            .json({ error: "Erreur serveur lors de l'enregistrement" });
    }
}
