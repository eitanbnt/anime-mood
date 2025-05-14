import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🧠 Correspondance genre → mood
const genreToMood = {
    Romance: "Amoureux",
    Comedy: "Feel-good",
    Horror: "Mind-blowing",
    Drama: "À pleurer",
    Action: "Énergique",
    SliceOfLife: "Calme",
    Fantasy: "Nostalgique",
    Psychological: "Mind-blowing",
    Supernatural: "Mind-blowing",
    Music: "Feel-good",
    Adventure: "Heureux",
    Sports: "Énergique",
    Mystery: "Mind-blowing",
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const animeList = await prisma.animeCache.findMany({
            include: {
                genres: true,
            },
        });

        const entries = [];

        for (const anime of animeList) {
            const genreNames = anime.genres?.map((g) => g.name) || [];

            const matchedMood =
                genreNames
                    .map((g) => genreToMood[g])
                    .find((m) => m !== undefined) || null;

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

            const genreText = genreNames.join(", ");

            entries.push({
                animeId: anime.animeId,
                title: anime.title,
                titleEnglish: anime.titleEnglish || "",
                imageUrl: anime.imageUrl,
                synopsis: anime.synopsis,
                trailer: anime.trailer || "",
                source: anime.source || "",
                episodes: anime.episodes || "",
                score: anime.score || "",
                mood: matchedMood,
                genres: genreText,
            });
        }

        await prisma.moodCache.deleteMany();
        await prisma.moodCache.createMany({ data: entries, skipDuplicates: true });

        res.status(200).json({ success: true, count: entries.length });
    } catch (err) {
        console.error("❌ Erreur build-mood-cache:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
