import { useEffect, useState } from "react"
import AnimeCard from "../components/AnimeCard"
import GenreFilter from "../components/GenreFilter"
import MoodFilter from "../components/MoodFilter"

/**
 * Page d'exploration d'animes avec recherche, filtres et pagination
 */
export default function ExplorePage() {
    const [animeCache, setAnimeCache] = useState([])
    const [moodCache, setMoodCache] = useState([])
    const [search, setSearch] = useState("")
    const [genreFilter, setGenreFilter] = useState("")
    const [moodFilter, setMoodFilter] = useState("")
    const [page, setPage] = useState(1)

    const itemsPerPage = 20

    useEffect(() => {
        // 🔁 Charge animeCache et moodCache au montage
        const loadData = async () => {
            const [animeRes, moodRes] = await Promise.all([
                fetch("/api/anime-cache"),
                fetch("/api/mood-cache")
            ])
            const animeData = await animeRes.json()
            const moodData = await moodRes.json()

            const parsedAnime = Array.isArray(animeData)
                ? animeData.map((anime) => ({
                    ...anime,
                    genres: typeof anime.genres === "string"
                        ? anime.genres.split(",").map((g) => g.trim())
                        : anime.genres || []
                }))
                : []

            setAnimeCache(parsedAnime)
            setMoodCache(Array.isArray(moodData) ? moodData : [])
        }

        loadData()
    }, [])

    // 🎯 Filtres appliqués
    const searchFiltered = animeCache.filter((anime) => {
        const matchTitle = anime.title.toLowerCase().includes(search.toLowerCase())
        const matchGenre = genreFilter ? anime.genres.includes(genreFilter) : true
        return matchTitle && matchGenre
    })

    const moodFiltered = moodFilter
        ? moodCache.filter((a) => a.mood === moodFilter)
        : moodCache

    const displayList = moodFilter ? moodFiltered : searchFiltered

    const paginated = displayList.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    )

    // 📋 Liste des genres et moods dispos
    const genres = [...new Set(animeCache.flatMap((a) => a.genres || []))]
    const moods = [...new Set(moodCache.map((a) => a.mood).filter(Boolean))]

    // 🔘 Actions des boutons
    const toggleGenre = (g) => {
        setGenreFilter((prev) => (prev === g ? "" : g))
        setPage(1)
    }

    const toggleMood = (m) => {
        setMoodFilter((prev) => (prev === m ? "" : m))
        setPage(1)
    }

    const handleSeen = async (animeId) => {
        const userId = localStorage.getItem("animeUsername")
        await fetch("/api/seen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animeId, userId })
        })
        alert("Ajouté aux vus ✅")
    }

    const handleFavorite = async (animeId) => {
        const userId = localStorage.getItem("animeUsername")
        await fetch("/api/favorite", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animeId, userId, isFavorite: true })
        })
        alert("Ajouté aux favoris 💾")
    }

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
                <GenreFilter genres={genres} selected={genreFilter} onSelect={toggleGenre} />
            )}

            {moods.length > 0 && (
                <MoodFilter moods={moods} selected={moodFilter} onSelect={toggleMood} />
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {paginated.map((anime) => (
                    <AnimeCard
                        key={anime.animeId || anime.id}
                        anime={anime}
                        onSeen={handleSeen}
                        onFavorite={handleFavorite}
                    />
                ))}
            </div>

            {/* ⬅️➡️ Pagination */}
            <div className="flex justify-center gap-4 mt-8">
                {page > 1 && (
                    <button
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        ← Précédent
                    </button>
                )}
                {displayList.length > page * itemsPerPage && (
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Suivant →
                    </button>
                )}
            </div>
        </div>
    )
}
