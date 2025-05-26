import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// correspondance 1 genre → 1 mood (garde-la ou remplace-la si besoin)
const genreToMood = {
    Romance: "Amoureux",
    Comedy: "Délirant",
    Horror: "Mind-blowing",
    Drama: "À pleurer",
    Action: "Énergique",
    SliceOfLife: "Feel-good",
    Fantasy: "Nostalgique",
    Psychological: "Mind-blowing",
    Supernatural: "Mind-blowing",
    Music: "Feel-good",
    Adventure: "Heureux",
    Sports: "Énergique",
    Mystery: "Mind-blowing",
    Thriller: "Mind-blowing",
    SciFi: "Mind-blowing",
    SuperPower: "Énergique",
    School: "Feel-good",
    Parody: "Délirant",
    Mecha: "Mind-blowing",
};

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ error: "Méthode non autorisée" });

    try {
        // on vide avant rebuild
        await prisma.moodCache.deleteMany();
        await prisma.mood.deleteMany();

        const animeList = await prisma.animeCache.findMany({
            include: { genres: true },
        });

        for (const anime of animeList) {
            const genreNames = anime.genres?.map((g) => g.name) || [];
            const matchedMood =
                genreNames.map((g) => genreToMood[g]).find((m) => m) || null;

            if (
                !anime.animeId ||
                !anime.title ||
                !anime.imageUrl ||
                !anime.synopsis ||
                !matchedMood
            ) {
                console.warn("⛔ Donnée incomplète ignorée :", anime);
                continue;
            }

            // 1️⃣ Upsert du MoodCache (métadonnées, pas de champ mood)
            await prisma.moodCache.upsert({
                where: { animeId: anime.animeId },
                update: {
                    title: anime.title,
                    titleEnglish: anime.titleEnglish ?? "",
                    imageUrl: anime.imageUrl,
                    synopsis: anime.synopsis,
                    trailer: anime.trailer ?? "",
                    source: anime.source ?? "",
                    episodes: anime.episodes ?? "",
                    score: anime.score ?? "",
                },
                create: {
                    animeId: anime.animeId,
                    title: anime.title,
                    titleEnglish: anime.titleEnglish ?? "",
                    imageUrl: anime.imageUrl,
                    synopsis: anime.synopsis,
                    trailer: anime.trailer ?? "",
                    source: anime.source ?? "",
                    episodes: anime.episodes ?? "",
                    score: anime.score ?? "",
                },
            });

            // 2️⃣ Upsert du Mood rattaché (clé unique sur animeId)
            await prisma.mood.upsert({
                where: { animeId: anime.animeId },
                update: { mood: matchedMood },
                create: {
                    animeId: anime.animeId,
                    mood: matchedMood,
                },
            });
        }

        res
            .status(200)
            .json({ success: true, count: await prisma.moodCache.count() });
    } catch (err) {
        console.error("❌ Erreur build-mood-cache :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
