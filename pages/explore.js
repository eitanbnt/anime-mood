// pages/explore.js
import { useEffect, useState } from "react";

export default function ExplorePage() {
    const [animeCache, setAnimeCache] = useState([]);
    const [moodCache, setMoodCache] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [genreFilter, setGenreFilter] = useState("");
    const [moodFilter, setMoodFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const loadData = async () => {
            const [animeRes, moodRes] = await Promise.all([
                fetch("/api/anime-cache"),
                fetch("/api/mood-cache")
            ]);
            const animeData = await animeRes.json();
            const moodData = await moodRes.json();

            const parsedAnime = Array.isArray(animeData)
                ? animeData.map((anime) => ({
                    ...anime,
                    genres: typeof anime.genres === "string"
                        ? anime.genres.split(",").map((g) => g.trim())
                        : anime.genres || [],
                }))
                : [];

            const parsedMood = Array.isArray(moodData) ? moodData : [];

            setAnimeCache(parsedAnime);
            setMoodCache(parsedMood);
            setFiltered(parsedAnime); // default filtered list for search
        };

        loadData();
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        const result = animeCache.filter((anime) => {
            const matchTitle = anime.title.toLowerCase().includes(lower);
            const matchGenre = genreFilter ? anime.genres.includes(genreFilter) : true;
            return matchTitle && matchGenre;
        });
        setFiltered(result);
        setCurrentPage(1);
    }, [search, genreFilter, animeCache]);

    const toggleGenre = (g) => {
        setGenreFilter((prev) => (prev === g ? "" : g));
    };

    const toggleMood = (m) => {
        setMoodFilter((prev) => (prev === m ? "" : m));
    };

    const genres = Array.isArray(animeCache)
        ? [...new Set(animeCache.flatMap((a) => a.genres))]
        : [];

    const moods = [...new Set(moodCache.map((a) => a.mood).filter(Boolean))];

    const moodFiltered = moodFilter
        ? moodCache.filter((anime) => anime.mood === moodFilter)
        : moodCache;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginated = moodFilter ? moodFiltered.slice(startIdx, startIdx + itemsPerPage) : filtered.slice(startIdx, startIdx + itemsPerPage);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Explorer les animes</h1>

            <input
                type="text"
                placeholder="Recherche par titre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
            />

            {genres.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-semibold">Genres :</h2>
                    <div className="flex gap-2 flex-wrap">
                        {genres.map((g) => (
                            <button
                                key={g}
                                onClick={() => toggleGenre(g)}
                                className={`px-3 py-1 rounded border ${genreFilter === g ? "bg-blue-500 text-white" : "bg-white"
                                    }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {moods.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-semibold">Moods :</h2>
                    <div className="flex gap-2 flex-wrap">
                        {moods.map((m) => (
                            <button
                                key={m}
                                onClick={() => toggleMood(m)}
                                className={`px-3 py-1 rounded border ${moodFilter === m ? "bg-pink-500 text-white" : "bg-white"
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {paginated.map((anime) => (
                    <div
                        key={anime.animeId || anime.id}
                        className="bg-white p-4 rounded-xl shadow"
                    >
                        <h2 className="text-lg font-semibold mb-2">{anime.title}</h2>
                        <img
                            src={anime.imageUrl}
                            alt={anime.title}
                            className="rounded mb-2"
                        />
                        <p className="text-sm text-gray-600 mb-1">
                            Genres : {(anime.genres || []).join(", ")}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                            {anime.synopsis?.slice(0, 120)}...
                        </p>

                        <div className="flex gap-4 text-sm">
                            <button
                                onClick={async () => {
                                    const userId = localStorage.getItem("animeUsername");
                                    await fetch("/api/seen", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            animeId: anime.animeId,
                                            userId,
                                        }),
                                    });
                                    alert("Ajouté aux vus");
                                }}
                                className="underline text-green-600"
                            >
                                ✅ Déjà vu
                            </button>
                            <button
                                onClick={async () => {
                                    const userId = localStorage.getItem("animeUsername");
                                    await fetch("/api/favorite", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            animeId: anime.animeId,
                                            userId,
                                            isFavorite: true,
                                        }),
                                    });
                                    alert("Ajouté aux favoris");
                                }}
                                className="underline text-orange-600"
                            >
                                💾 Favori
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
                {currentPage > 1 && (
                    <button
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        ← Précédent
                    </button>
                )}
                {(moodFilter ? moodFiltered.length : filtered.length) > startIdx + itemsPerPage && (
                    <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Suivant →
                    </button>
                )}
            </div>
        </div>
    );
}
