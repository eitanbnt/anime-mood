import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔁 Pondération des genres en fonction des goûts utilisateur
async function getUserPreferences(userId) {
  const recs = await prisma.recommendation.findMany({
    where: { userId },
    select: { genres: true },
  });

  const genreCount = {};

  for (const rec of recs) {
    const genreList =
      typeof rec.genres === "string"
        ? rec.genres.split(",")
        : rec.genres || [];

    for (const g of genreList) {
      const genre = g.trim();
      if (genre) genreCount[genre] = (genreCount[genre] || 0) + 1;
    }
  }

  return { genreCount };
}

export default async function handler(req, res) {
  const { mood, userId } = req.query;
  const cleanMood = decodeURIComponent(mood);

  if (!cleanMood || !userId) {
    return res.status(400).json({ error: "Paramètres manquants" });
  }

  try {
    // 🎯 Recommandations disponibles pour ce mood
    const moodEntries = await prisma.moodCache.findMany({
      where: { mood: cleanMood },
      include: { anime: true }, // grâce à ton schema mis à jour
    });

    // 👀 Animes déjà vus par l'utilisateur
    const seen = await prisma.recommendation.findMany({
      where: { userId },
      select: { animeId: true },
    });

    const seenIds = new Set(seen.map((r) => r.animeId));
    const prefs = await getUserPreferences(userId);

    const unseen = moodEntries
      .filter((entry) => entry.anime && !seenIds.has(entry.anime.animeId))
      .map((entry) => {
        const { anime } = entry;
        const genreList =
          typeof anime.genres === "string"
            ? anime.genres.split(",")
            : anime.genres || [];

        const score = genreList.reduce(
          (sum, g) => sum + (prefs.genreCount[g.trim()] || 0),
          0
        );

        return {
          ...anime,
          mood: cleanMood,
          score,
        };
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
            titleEnglish: anime.titleEnglish,
            imageUrl: anime.imageUrl,
            synopsis: anime.synopsis,
            mood: cleanMood,
            userId,
            genres: Array.isArray(anime.genres)
              ? anime.genres.map((g) => g.name).join(", ")
              : anime.genres || "",
            trailer: anime.trailer,
            source: anime.source,
            episodes: anime.episodes,
            score: anime.score?.toString() || null,
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
