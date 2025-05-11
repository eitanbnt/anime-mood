import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([])
    const [search, setSearch] = useState("")
    const [ready, setReady] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const userId = localStorage.getItem("animeUsername")
        if (!userId) {
            router.replace("/login")
        } else {
            fetch(`/api/favorite?userId=${userId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) setFavorites(data)
                })
                .catch((err) => console.error("Erreur favoris :", err))
                .finally(() => setReady(true))
        }
    }, [router])

    const filtered = favorites.filter((fav) =>
        fav.title.toLowerCase().includes(search.toLowerCase())
    )

    const handleRemove = async (animeId) => {
        const userId = localStorage.getItem("animeUsername")
        await fetch("/api/favorite", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animeId, userId, isFavorite: false }),
        })
        setFavorites(favorites.filter((f) => f.animeId !== animeId))
    }

    const handleSeen = async (animeId) => {
        const userId = localStorage.getItem("animeUsername")
        await fetch("/api/seen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animeId, userId }),
        })
        alert("✅ Marqué comme vu")
    }

    if (!ready) return null

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <a href="/" className="inline-block mb-6 text-blue-600 underline">
                ← Retour à l’accueil
            </a>

            <h1 className="text-2xl font-bold mb-4">💾 Mes favoris</h1>

            <input
                type="text"
                placeholder="Rechercher un titre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-6"
            />

            {filtered.length === 0 ? (
                <p>Aucun favori trouvé 😶</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {filtered.map((anime) => (
                        <div key={anime.animeId} className="bg-white p-4 rounded-xl shadow">
                            <h2 className="text-lg font-semibold mb-2">{anime.title}</h2>
                            <img src={anime.imageUrl} alt={anime.title} className="rounded mb-2 max-h-60 w-full object-cover" />
                            <p className="text-sm text-gray-600 mb-2">{anime.synopsis?.slice(0, 100)}...</p>
                            <div className="flex gap-4 text-sm">
                                <button
                                    onClick={() => handleSeen(anime.animeId)}
                                    className="text-green-600 underline"
                                >
                                    ✅ Déjà vu
                                </button>
                                <button
                                    onClick={() => handleRemove(anime.animeId)}
                                    className="text-red-600 underline"
                                >
                                    ❌ Retirer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
