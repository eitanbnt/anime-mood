import { useState } from "react"
import { useRouter } from "next/router"

/**
 * Page de connexion sans mot de passe — définit juste un pseudo
 */
export default function LoginPage() {
    const [input, setInput] = useState("")
    const router = useRouter()

    const handleLogin = () => {
        if (!input.trim()) return alert("Choisis un pseudo !")
        localStorage.setItem("animeUsername", input.trim())
        router.replace("/")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
            <div className="max-w-md w-full bg-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-4 text-center">Bienvenue 👋</h1>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Choisis ton nom d’utilisateur pour commencer.
                </p>

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ton pseudo..."
                    className="mb-4"
                />

                <button
                    onClick={handleLogin}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    🚀 Commencer
                </button>
            </div>
        </div>
    )
}
