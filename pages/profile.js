import { useRouter } from "next/router"
import { useEffect, useState } from "react"

/**
 * Page profil — permet de changer son pseudo ou se déconnecter
 */
export default function ProfilePage() {
    const [username, setUsername] = useState("")
    const [input, setInput] = useState("")
    const router = useRouter()

    useEffect(() => {
        const stored = localStorage.getItem("animeUsername")
        if (!stored) {
            router.replace("/login")
        } else {
            setUsername(stored)
            setInput(stored)
        }
    }, [router])

    const handleSave = () => {
        if (input.trim()) {
            localStorage.setItem("animeUsername", input.trim())
            setUsername(input.trim())
            alert("✅ Pseudo mis à jour")
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("animeUsername")
        router.replace("/login")
    }

    return (
        <div className="max-w-xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
            <a href="/" className="inline-block mb-4 text-blue-600 underline">
                ← Retour à l’accueil
            </a>
            <a href="/admin" className="inline-block mb-4 text-blue-600 underline">
                Page Admin
            </a>

            <h1 className="text-2xl font-bold mb-4">👤 Mon profil</h1>

            <label className="block mb-2 text-sm font-medium">Nom d’utilisateur</label>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mb-4"
                placeholder="Ton pseudo..."
            />

            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    💾 Enregistrer
                </button>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    🔒 Déconnexion
                </button>
            </div>

            {username && (
                <p className="mt-6 text-sm text-gray-600">
                    Connecté en tant que <strong>{username}</strong>
                </p>
            )}
        </div>
    )
}
