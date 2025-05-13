import { useRouter } from "next/router"
import { useEffect, useState } from "react"

function TranslateSynopsis({ original }) {
    const [translated, setTranslated] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleTranslate = async () => {
        setLoading(true)
        try {
            const res = await fetch("https://translate.argosopentech.com/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    q: original,
                    source: "en",
                    target: "fr",
                    format: "text",
                }),
            })
            const data = await res.json()
            setTranslated(data.translatedText)
        } catch (err) {
            setTranslated("❌ Erreur de traduction")
        } finally {
            setLoading(false)
        }
    }

    if (translated) return <p className="text-sm text-gray-700">{translated}</p>

    return (
        <div>
            <p className="text-sm text-gray-500 mb-1">{original}</p>
            <button
                onClick={handleTranslate}
                className="text-sm text-blue-600 underline"
                disabled={loading}
            >
                {loading ? "Traduction..." : "📄 Traduire le synopsis"}
            </button>
        </div>
    )
}

// 🎨 Dictionnaire pour couleurs + emojis par mood
const moodStyle = {
    Heureux: { color: "bg-green-100", emoji: "😄" },
    Triste: { color: "bg-blue-100", emoji: "😢" },
    Nostalgique: { color: "bg-purple-100", emoji: "🕰️" },
    Énergique: { color: "bg-red-100", emoji: "💥" },
    Amoureux: { color: "bg-pink-100", emoji: "❤️" },
    Calme: { color: "bg-gray-100", emoji: "😌" },
    "Mind-blowing": { color: "bg-indigo-100", emoji: "🤯" },
    "À pleurer": { color: "bg-blue-200", emoji: "😭" },
    Délirant: { color: "bg-yellow-100", emoji: "🤪" },
    "Feel-good": { color: "bg-orange-100", emoji: "☀️" },
}

export default function RecommendationPage() {
    const router = useRouter()
    const { mood } = router.query

    const [animes, setAnimes] = useState([])
    const [loading, setLoading] = useState(true)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const username = localStorage.getItem("animeUsername")
        if (!username) router.replace("/login")
        else setReady(true)
    }, [router])

    const fetchRecommendations = async () => {
        setLoading(true)
        const userId = localStorage.getItem("animeUsername")

        try {
            const res = await fetch(`/api/recommend?mood=${encodeURIComponent(mood)}&userId=${userId}`)
            const data = await res.json()
            setAnimes(data)
        } catch (err) {
            console.error("Erreur de chargement :", err)
            setAnimes([])
        } finally {
            setLoading(false)
        }
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

    const handleFavorite = async (animeId) => {
        const userId = localStorage.getItem("animeUsername")
        await fetch("/api/favorite", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animeId, userId, isFavorite: true }),
        })
        alert("💾 Ajouté aux favoris")
    }

    useEffect(() => {
        if (mood && ready) fetchRecommendations()
    }, [mood, ready])

    const style = moodStyle[mood] || { color: "bg-gray-100", emoji: "❓" }

    if (!ready) return null
    if (loading) return <div className="p-8">Chargement...</div>
    if (!animes.length) return <div className="p-8">Aucun anime trouvé 😢</div>

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
            <a href="/" className="inline-block mb-6 text-blue-600 underline">← Retour à l’accueil</a>

            <h1 className="text-2xl font-bold mb-4">
                {style.emoji} Recommandations pour l’humeur : <span className="capitalize">{mood}</span>
            </h1>

            <button
                onClick={fetchRecommendations}
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                🔁 Recommander d'autres
            </button>

            <div className="grid md:grid-cols-3 gap-6">
                {animes.map((anime, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-2">{anime.title}</h2>
                        <img
                            src={anime.imageUrl}
                            alt={anime.title}
                            className="rounded mb-2 max-h-60 w-full object-cover"
                        />

                        <p className="text-sm text-gray-600 mb-1">
                            Genres :{" "}
                            {(typeof anime.genres === "string"
                                ? anime.genres.split(",")
                                : anime.genres || []
                            ).join(", ")}
                        </p>

                        <TranslateSynopsis original={anime.synopsis} />

                        <div className="flex gap-3 text-sm mt-3">
                            <button
                                onClick={() => handleSeen(anime.animeId)}
                                className="text-green-600 underline"
                            >
                                ✅ Déjà vu
                            </button>
                            <button
                                onClick={() => handleFavorite(anime.animeId)}
                                className="text-orange-600 underline"
                            >
                                💾 Favori
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}
