import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function SeenPage() {
    const [seen, setSeen] = useState([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const username = localStorage.getItem("animeUsername")
        if (!username) {
            router.push("/login")
            return
        }

        const fetchSeen = async () => {
            const res = await fetch(`/api/seen-list?userId=${username}`)
            const data = await res.json()
            console.log("Données reçues de /api/seen-list :", data)
            setSeen(data)
            setLoading(false)
        }

        fetchSeen()
    }, [router])

    if (loading) return <div className="p-6">Chargement...</div>

    return (
        <div className="max-w-5xl mx-auto p-6">
            <a href="/" className="inline-block text-blue-600 underline mb-4">← Retour</a>
            <h1 className="text-2xl font-bold mb-6">🎬 Animes déjà vus</h1>

            {seen.length === 0 ? (
                <p>Aucun anime marqué comme vu.</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {Array.isArray(seen) && seen.map(anime => (
                        <div key={anime.id} className="bg-white p-4 rounded-xl shadow">
                            <h2 className="text-lg font-semibold mb-2">{anime.title}</h2>
                            <img src={anime.imageUrl} alt={anime.title} className="rounded mb-2" />
                            <p className="text-sm text-gray-600 mb-2">{anime.mood && `Humeur : ${anime.mood}`}</p>
                            <p className="text-xs text-gray-400">Vu le : {new Date(anime.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
