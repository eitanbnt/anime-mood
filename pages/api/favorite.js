import { PrismaClient } from "@prisma/client";
import getMoodsForGenres from "./mood"; // ta table de correspondance genre → moods

const prisma = new PrismaClient();

/** pondération des genres déjà aimés */
async function getUserPreferences(userId) {
    const recs = await prisma.recommendation.findMany({
        where: { userId },
        select: { genres: true },
    });

    const prefs = {};
    for (const rec of recs) {
        const list = typeof rec.genres === "string" ? rec.genres.split(",") : [];
        for (const g of list.map((s) => s.trim()).filter(Boolean)) {
            prefs[g] = (prefs[g] || 0) + 1;
        }
    }
    return prefs;
}

export default async function handler(req, res) {
    const { mood, userId } = req.query;
    if (!mood || !userId)
        return res.status(400).json({ error: "Paramètres manquants" });

    const cleanMood = decodeURIComponent(mood);

    try {
        /* 1️⃣  les animes portant ce mood                                           */
        const moodRows = await prisma.mood.findMany({
            where: { mood: cleanMood },
            select: { animeId: true },
        });
        const animeIds = moodRows.map((m) => m.animeId);
        if (!animeIds.length) return res.status(200).json([]);

        /* 2️⃣  métadonnées de ces animes + genres                                   */
        const animes = await prisma.animeCache.findMany({
            where: { animeId: { in: animeIds } },
            include: { genres: true },
        });

        /* 3️⃣  filtrer ceux déjà vus                                                */
        const seen = await prisma.recommendation.findMany({
            where: { userId },
            select: { animeId: true },
        });
        const seenIds = new Set(seen.map((s) => s.animeId));

        const prefs = await getUserPreferences(userId);
        const moodsByGenre = await getMoodsForGenres(); // {Adventure:["Heureux",…]}

        const scored = animes
            .filter((a) => !seenIds.has(a.animeId))
            .map((a) => {
                const genreNames = a.genres.map((g) => g.name);
                const score = genreNames.reduce((sum, g) => {
                    return sum + (moodsByGenre[g]?.includes(cleanMood) ? prefs[g] || 0 : 0);
                }, 0);
                return {
                    animeId: a.animeId,
                    title: a.title,
                    titleEnglish: a.titleEnglish ?? "",
                    imageUrl: a.imageUrl,
                    synopsis: a.synopsis ?? "",
                    trailer: a.trailer ?? "",
                    source: a.source ?? "",
                    episodes: a.episodes ?? "",
                    score: a.score ?? "",
                    genres: genreNames.join(", "),
                    compute: score,
                };
            });

        if (!scored.length) return res.status(200).json([]);

        /** 4️⃣  top 3 et persistance                                                */
        const top = scored.sort((a, b) => b.compute - a.compute).slice(0, 3);

        await prisma.$transaction(
            top.map((a) =>
                prisma.recommendation.create({
                    data: {
                        animeId: a.animeId,
                        title: a.title,
                        titleEnglish: a.titleEnglish,
                        imageUrl: a.imageUrl,
                        synopsis: a.synopsis,
                        trailer: a.trailer,
                        source: a.source,
                        episodes: a.episodes,
                        score: String(a.score),
                        mood: cleanMood,
                        userId,
                        genres: a.genres,
                    },
                })
            )
        );

        res.status(200).json(top);
    } catch (err) {
        console.error("Erreur /api/recommend :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}
