import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Profile() {
    const router = useRouter()
    const [username, setUsername] = useState("")

    useEffect(() => {
        const check = () => {
            const saved = localStorage.getItem("animeUsername")
            if (!saved) {
                router.push("/login")
            } else {
                setUsername(saved)
            }
        }
        check()
    }, [router])

    const handleSave = () => {
        if (username.trim()) {
            localStorage.setItem("animeUsername", username)
            alert("✅ Pseudo mis à jour")
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("animeUsername")
        router.push("/login")
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <a href="/" className="text-blue-500 underline">← Retour à l’accueil</a>
            <h1 className="text-2xl font-bold mt-4 mb-4">👤 Mon profil</h1>

            <label className="block text-sm font-medium mb-2">Pseudo</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded px-4 py-2 mb-4"
            />

            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    💾 Enregistrer
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    🔓 Se déconnecter
                </button>
            </div>
        </div>
    )
}
