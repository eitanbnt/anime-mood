import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function StatsPage() {
    const [stats, setStats] = useState(null)
    const [ready, setReady] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const userId = localStorage.getItem("animeUsername")
        if (!userId) {
            router.replace("/login")
            return
        }

        fetch(`/api/stats?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error("Erreur stats :", err))
            .finally(() => setReady(true))
    }, [router])

    if (!ready) return null

    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <a href="/" className="inline-block mb-6 text-blue-600 underline">
                ← Retour à l’accueil
            </a>

            <h1 className="text-2xl font-bold mb-4">📊 Mes statistiques</h1>

            {!stats ? (
                <p>Chargement...</p>
            ) : (
                <div className="space-y-4 text-sm">
                    <p>📦 Total de recommandations : {stats.total}</p>
                    <p>💾 Favoris enregistrés : {stats.favorites}</p>
                    <p>✅ Animes vus : {stats.seen}</p>

                    <div>
                        <h2 className="mt-6 font-semibold">Top humeurs :</h2>
                        <ul className="list-disc ml-5">
                            {stats.moods &&
                                Object.entries(stats.moods).map(([mood, count]) => (
                                    <li key={mood}>
                                        {mood} — {count} recommandation{count > 1 ? "s" : ""}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
