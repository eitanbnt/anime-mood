import { useEffect, useState } from "react"

export default function ExplorePage() {
    const [animeCache, setAnimeCache] = useState([])
    const [filtered, setFiltered] = useState([])
    const [search, setSearch] = useState("")
    const [genreFilter, setGenreFilter] = useState("")
    const [moodFilter, setMoodFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 9

    useEffect(() => {
        fetch("/api/anime-cache")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setAnimeCache(data)
                    setFiltered(data)
                }
            })
    }, [])

    useEffect(() => {
        const lower = search.toLowerCase()
        const result = animeCache.filter((anime) => {
            const matchTitle = anime.title.toLowerCase().includes(lower)
            const matchGenre = genreFilter
                ? (anime.genres || "").split(",").map((g) => g.trim()).includes(genreFilter)
                : true
            const matchMood = moodFilter ? anime.mood === moodFilter : true
            return matchTitle && matchGenre && matchMood
        })

        setFiltered(result)
        setCurrentPage(1) // reset page à chaque nouveau filtre
    }, [search, genreFilter, moodFilter, animeCache])

    const genres = Array.from(new Set(
        animeCache.flatMap((a) =>
            typeof a.genres === "string"
                ? a.genres.split(",").map((g) => g.trim())
                : []
        )
    ))

    const moods = [
        "Heureux",
        "Triste",
        "Nostalgique",
        "Énergique",
        "Amoureux",
        "Calme",
        "Mind-blowing",
        "À pleurer",
        "Délirant",
        "Feel-good",
    ]

    const pageCount = Math.ceil(filtered.length / itemsPerPage)
    const startIdx = (currentPage - 1) * itemsPerPage
    const currentItems = filtered.slice(startIdx, startIdx + itemsPerPage)

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">🔎 Explorer les animes</h1>

            <input
                type="text"
                placeholder="Rechercher un anime..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mb-6 p-2 border rounded"
            />

            <div className="mb-4">
                <h2 className="font-semibold mb-1">🎭 Genres</h2>
                <div className="flex flex-wrap gap-2">
                    {genres.map((g) => (
                        <button
                            key={g}
                            onClick={() => setGenreFilter(genreFilter === g ? "" : g)}
                            className={`px-3 py-1 rounded border text-sm ${genreFilter === g
                                    ? "bg-blue-600 text-white"
                                    : "bg-white hover:bg-blue-50"
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h2 className="font-semibold mb-1">🎨 Humeurs</h2>
                <div className="flex flex-wrap gap-2">
                    {moods.map((m) => (
                        <button
                            key={m}
                            onClick={() => setMoodFilter(moodFilter === m ? "" : m)}
                            className={`px-3 py-1 rounded border text-sm ${moodFilter === m
                                    ? "bg-pink-500 text-white"
                                    : "bg-white hover:bg-pink-50"
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {currentItems.length === 0 ? (
                <p>Aucun résultat 😶</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    {currentItems.map((anime) => (
                        <div
                            key={anime.animeId}
                            className="bg-white p-4 rounded-xl shadow"
                        >
                            <h2 className="text-lg font-semibold mb-2">{anime.title}</h2>
                            <img
                                src={anime.imageUrl}
                                alt={anime.title}
                                className="rounded mb-2"
                            />
                            <p className="text-sm text-gray-500 mb-1">{anime.genres}</p>
                            <p className="text-sm text-gray-600 mb-2">
                                {anime.synopsis?.slice(0, 120)}...
                            </p>

                            <div className="flex gap-3 text-sm">
                                <button
                                    onClick={async () => {
                                        const userId = localStorage.getItem("animeUsername")
                                        await fetch("/api/seen", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ animeId: anime.animeId, userId }),
                                        })
                                        alert("Ajouté aux vus ✅")
                                    }}
                                    className="text-green-600 underline"
                                >
                                    ✅ Vu
                                </button>
                                <button
                                    onClick={async () => {
                                        const userId = localStorage.getItem("animeUsername")
                                        await fetch("/api/favorite", {
                                            method: "PATCH",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                animeId: anime.animeId,
                                                userId,
                                                isFavorite: true,
                                            }),
                                        })
                                        alert("Ajouté aux favoris 💾")
                                    }}
                                    className="text-orange-600 underline"
                                >
                                    💾 Favori
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pageCount > 1 && (
                <div className="mt-6 flex justify-center gap-4 items-center">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        ← Précédent
                    </button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage} / {pageCount}
                    </span>

                    <button
                        disabled={currentPage === pageCount}
                        onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Suivant →
                    </button>
                </div>
            )}
        </div>
    )
}
