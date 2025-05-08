import { useState } from "react"
import { useRouter } from "next/router"

export default function Login() {
    const [username, setUsername] = useState("")
    const router = useRouter()

    const handleLogin = () => {
        if (username.trim()) {
            localStorage.setItem("animeUsername", username)
            router.replace("/")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm">
                <h1 className="text-xl font-bold mb-4">🔐 Connexion</h1>
                <input
                    type="text"
                    placeholder="Ton pseudo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded"
                />
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
                >
                    Se connecter
                </button>
            </div>
        </div>
    )
}
