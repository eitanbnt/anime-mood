import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function AdminPage() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState("")
    const router = useRouter()

    useEffect(() => {
        const user = localStorage.getItem("animeUsername")
        if (user !== "admin") {
            router.replace("/")
        }
    }, [router])

    const call = async (url, method = "GET") => {
        setLogs((prev) => [...prev, `⏳ Appel de ${url}...`])
        try {
            const res = await fetch(url, { method })
            const json = await res.json()
            setLogs((prev) => [...prev, `✅ ${url} → ${JSON.stringify(json)}`])
        } catch (e) {
            setLogs((prev) => [...prev, `❌ Erreur : ${url}`])
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
            <a href="/" className="inline-block mb-6 text-blue-600 underline">
                ← Retour à l’accueil
            </a>
            <h1 className="text-2xl font-bold mb-4">🛠️ Admin panel</h1>

            <div className="space-y-3 mb-6">
                <button
                    onClick={() => call("/api/update-cache", "POST")}
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                    🔁 Mettre à jour animeCache {loading === "/api/update-cache" && "⏳"}
                </button>

                <button
                    onClick={() => call("/api/build-mood-cache", "POST")}
                    className="px-4 py-2 bg-pink-600 text-white rounded"
                >
                    🧠 Reconstruire moodCache
                </button>

                <button
                    onClick={() => call("/api/clear-cache", "POST")}
                    disabled={loading}
                    className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
                >
                    🗑️ Vider les caches {loading === "/api/clear-cache" && "⏳"}
                </button>
            </div>

            <h2 className="font-semibold text-lg mb-2">📋 Logs :</h2>
            <div className="bg-white p-4 rounded-xl shadow text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {logs.length === 0 ? "Aucune action encore." : logs.join("\n")}
            </div>
        </div>
    )
}
