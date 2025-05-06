import axios from 'axios';

const moodToGenre = {
  Heureux: ["slice of life", "comedy"],
  Triste: ["drama", "psychological"],
  Nostalgique: ["romance", "music"],
  Énergique: ["sports", "action"],
  Amoureux: ["romance", "shoujo"],
};

export default async function handler(req, res) {
  const { mood } = req.query;

  if (!mood || typeof mood !== "string") {
    return res.status(400).json({ error: "Aucune humeur fournie" });
  }

  const genres = moodToGenre[mood] || ["drama"];

  try {
    const query = genres.join(",");
    const response = await axios.get("https://api.jikan.moe/v4/anime", {
      params: {
        q: "",
        genres: query,
        limit: 10,
        order_by: "score",
        sort: "desc"
      }
    });

    const animeList = response.data.data;

    if (!animeList || animeList.length === 0) {
      return res.status(404).json({ error: "Aucun anime trouvé" });
    }

    const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];

    res.status(200).json({
      title: randomAnime.title,
      imageUrl: randomAnime.images.jpg.image_url,
      synopsis: randomAnime.synopsis,
      malId: randomAnime.mal_id,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}