// pages/api/mood.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* -------------------------------------------------------------------------- */
/*  1. Dictionnaire fixe : genre  →  liste de moods                           */
/*     (libellés exactement identiques à ceux affichés côté front)            */
/* -------------------------------------------------------------------------- */
const GENRE_TO_MOODS = {
  "Adventure":       ["Heureux", "Énergique", "Feel-good"],
  "Drama":           ["Triste", "Nostalgique", "Calme"],
  "Fantasy":         ["Heureux", "Énergique", "Mind-blowing", "Amoureux"],
  "Action":          ["Énergique", "Mind-blowing", "Heureux"],
  "Sci-Fi":          ["Mind-blowing", "Énergique", "Nostalgique", "Calme"],
  "Suspense":        ["Mind-blowing", "Triste", "Calme"],
  "Comedy":          ["Heureux", "Délirant", "Feel-good", "Calme"],
  "Supernatural":    ["Mind-blowing", "Heureux", "Calme"],
  "Romance":         ["Amoureux", "Heureux", "Calme"],
  "Award Winning":   ["Nostalgique", "Calme", "Triste"],
  "Mystery":         ["Mind-blowing", "Triste", "Calme"],
  "Sports":          ["Énergique", "Heureux", "Feel-good"],
  "Slice of Life":   ["Calme", "Amoureux", "Triste"],
  "Ecchi":           ["Amoureux", "Délirant"],
  "Gourmet":         ["Calme", "Heureux", "Feel-good"],
  "Horror":          ["Triste", "Mind-blowing", "À pleurer"],
  "Avant Garde":     ["Mind-blowing", "Nostalgique", "Calme"],
  "Boys Love":       ["Amoureux", "Calme"],
  "Hentai":          ["Amoureux", "Délirant"],
  "Girls Love":      ["Amoureux", "Calme"],
  "Erotica":         ["Amoureux", "Calme"]
};

/* -------------------------------------------------------------------------- */
/*  2. On ne lit la liste des genres qu’une seule fois                         */
/* -------------------------------------------------------------------------- */
let cachedGenreList = null;
async function getAllGenres() {
  if (cachedGenreList) return cachedGenreList;
  const rows = await prisma.genre.findMany({ select: { name: true } });
  cachedGenreList = rows.map((g) => g.name);
  return cachedGenreList;
}

/* -------------------------------------------------------------------------- */
/*  3. Fonctions exportées                                                    */
/* -------------------------------------------------------------------------- */
export async function getMoodsForGenre(genre) {
  return GENRE_TO_MOODS[genre] || [];
}

/**
 * Renvoie un objet { [genre]: [mood1, mood2, …] }
 * pour tous les genres présents dans la base.
 */
export default async function getMoodsForGenres() {
  const genres = await getAllGenres();
  const out = {};
  for (const g of genres) out[g] = GENRE_TO_MOODS[g] || [];
  return out;
}
