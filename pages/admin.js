import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function AdminPage() {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const username = localStorage.getItem("animeUsername")
        if (username === "admin") {
            setAuthorized(true)
        } else {
            router.push("/login")
        }
    }, [router])

    if (!authorized) return null

    return (
        <div className="max-w-3xl mx-auto p-6">
            <a href="/" className="inline-block mb-6 text-blue-600 underline">
                ← Retour à l’accueil
            </a>
            <h1 className="text-2xl font-bold mb-4">🔐 Espace Admin</h1>

            <p className="text-gray-700 mb-6">Bienvenue, admin !</p>

            <button
                onClick={async () => {
                    const res = await fetch("/api/update-cache", { method: "POST" })
                    const data = await res.json()
                    alert(`✅ Base mise à jour avec ${data.count} animes`)
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
                🔁 Mettre à jour la base anime
            </button>
        </div>
    )
}
