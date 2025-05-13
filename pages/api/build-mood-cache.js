import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        const animeList = await prisma.animeCache.findMany({
            include: {
                genres: true,
                moodCache: true,
            },
        });

        const entries = [];

        for (const anime of animeList) {
            // Vérifie que le mood est défini via moodCache
            const mood = anime.moodCache?.mood;
            if (!anime.animeId || !anime.title || !anime.imageUrl || !anime.synopsis || !mood) {
                console.warn("⛔ Donnée incomplète ignorée :", anime);
                continue;
            }

            // Transforme les genres liés en texte
            const genreText = anime.genres?.map((g) => g.name).join(", ") || "";

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
                mood: mood,
                genres: genreText,
            });
        }

        // Réinitialisation
        await prisma.moodCache.deleteMany();
        await prisma.moodCache.createMany({ data: entries, skipDuplicates: true });

        res.status(200).json({ success: true, count: entries.length });
    } catch (err) {
        console.error("❌ Erreur build-mood-cache:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
