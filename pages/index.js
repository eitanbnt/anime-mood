import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const moodOptions = {
  Heureux: "😄",
  Triste: "😢",
  Nostalgique: "🕰️",
  Énergique: "💥",
  Amoureux: "❤️",
  Calme: "😌",
  "Mind-blowing": "🤯",
  "À pleurer": "😭",
  Délirant: "🤪",
  "Feel-good": "☀️",
}

export default function Home() {
  const router = useRouter()
  const [username, setUsername] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("animeUsername")
    if (!saved) {
      router.replace("/login")
    } else {
      setUsername(saved)
    }
  }, [router])

  const handleClick = (mood) => {
    router.push(`/recommendation?mood=${encodeURIComponent(mood)}`)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <a href="/profile" className="text-sm underline text-gray-600 absolute top-4 right-4">
        👤 Mon profil
      </a>

      <h1 className="text-3xl font-bold mb-2 text-center">Bienvenue, {username} !</h1>
      <p className="mb-6 text-center text-sm text-gray-600">Quel est ton mood aujourd’hui ?</p>

      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {Object.entries(moodOptions).map(([mood, emoji]) => (
          <button
            key={mood}
            onClick={() => handleClick(mood)}
            className="px-4 py-2 bg-white rounded shadow hover:bg-gray-100"
          >
            {emoji} {mood}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2 mt-6 text-sm">
        <a href="/explore" className="text-blue-600 underline">🔍 Explorer les animes</a>
        <a href="/favorites" className="text-blue-600 underline">💾 Voir mes favoris</a>
        <a href="/history" className="text-blue-600 underline">📜 Historique des recommandations</a>
        <a href="/quiz" className="text-blue-600 underline">🎮 Lancer le quiz d’humeur</a>
      </div>
    </div>
  )
}
