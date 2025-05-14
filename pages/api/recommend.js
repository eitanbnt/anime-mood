import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔁 Pondération des préférences utilisateur (genres aimés)
async function getUserPreferences(userId) {
  const recs = await prisma.recommendation.findMany({
    where: { userId },
    select: { genres: true },
  });

  const genreCount = {};

  for (const rec of recs) {
    const genreList =
      typeof rec.genres === "string" ? rec.genres.split(",") : [];
    for (const g of genreList) {
      const genre = g.trim();
      if (genre) genreCount[genre] = (genreCount[genre] || 0) + 1;
    }
  }

  return genreCount;
}

export default async function handler(req, res) {
  const { mood, userId } = req.query;
  const cleanMood = decodeURIComponent(mood);

  if (!cleanMood || !userId) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    const genrePrefs = await getUserPreferences(userId);

    const moodEntries = await prisma.moodCache.findMany({
      where: { mood: cleanMood },
    });

    const seen = await prisma.recommendation.findMany({
      where: { userId },
      select: { animeId: true },
    });

    const seenIds = new Set(seen.map((r) => r.animeId));

    const unseen = moodEntries
      .filter((a) => !seenIds.has(a.animeId))
      .map((anime) => {
        const genreList =
          typeof anime.genres === "string" ? anime.genres.split(",") : [];
        const score = genreList.reduce(
          (sum, g) => sum + (genrePrefs[g.trim()] || 0),
          0
        );
        return { ...anime, score };
      });

    if (unseen.length === 0) {
      return res.status(200).json([]);
    }

    const selected = unseen.sort((a, b) => b.score - a.score).slice(0, 3);

    await Promise.all(
      selected.map((anime) =>
        prisma.recommendation.create({
          data: {
            animeId: anime.animeId,
            title: anime.title,
            titleEnglish: anime.titleEnglish || "",
            imageUrl: anime.imageUrl,
            synopsis: anime.synopsis,
            trailer: anime.trailer,
            source: anime.source,
            episodes: anime.episodes,
            score: String(anime.score || ""),
            mood: cleanMood,
            userId,
            genres: anime.genres, // sauvegarde dans recommendation
          },
        })
      )
    );

    res.status(200).json(selected);
  } catch (error) {
    console.error("Erreur recommandation :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
