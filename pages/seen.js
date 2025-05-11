import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function SeenPage() {
    const [seen, setSeen] = useState([])
    const [search, setSearch] = useState("")
    const [ready, setReady] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const userId = localStorage.getItem("animeUsername")
        if (!userId) {
            router.replace("/login")
            return
        }

        fetch(`/api/seen-list?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => Array.isArray(data) && setSeen(data))
            .catch((err) => console.error("Erreur récupération des vus :", err))
            .finally(() => setReady(true))
    }, [router])

    const filtered = seen.filter((anime) =>
        anime.title.toLowerCase().includes(search.toLowerCase())
    )

    if (!ready) return null

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <a href="/" className="inline-block mb-6 text-blue-600 underline">
                ← Retour à l’accueil
            </a>

            <h1 className="text-2xl font-bold mb-4">👁️‍🗨️ Animes déjà vus</h1>

            <input
                type="text"
                placeholder="Rechercher un titre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-6"
            />

            {filtered.length === 0 ? (
                <p>Aucun anime vu 😶</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {filtered.map((anime) => (
                        <div key={anime.animeId} className="bg-white p-4 rounded-xl shadow">
                            <h2 className="text-lg font-semibold mb-2">{anime.title}</h2>
                            <img
                                src={anime.imageUrl}
                                alt={anime.title}
                                className="rounded mb-2 max-h-60 w-full object-cover"
                            />
                            <p className="text-sm text-gray-600 mb-1">{anime.synopsis?.slice(0, 120)}...</p>
                            <p className="text-xs text-gray-500">Vu le : {new Date(anime.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
