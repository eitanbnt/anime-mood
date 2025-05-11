import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const moods = {
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

export default function HomePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("animeUsername")
    if (!saved) {
      router.push("/login")
    } else {
      setUsername(saved)
    }
  }, [router])

  const handleClick = (mood) => {
    router.push(`/recommendation?mood=${encodeURIComponent(mood)}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        Salut {username || "!"} 👋 Quel est ton mood aujourd’hui ?
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.entries(moods).map(([label, emoji]) => (
          <button
            key={label}
            onClick={() => handleClick(label)}
            className="bg-white shadow rounded-xl px-4 py-3 text-lg hover:bg-blue-50 transition"
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 text-sm text-blue-600 underline">
        <div className="grid gap-4 mt-6 md:grid-cols-2">
          <a
            href="/explore"
            className="bg-white shadow hover:bg-blue-50 text-blue-700 px-5 py-3 rounded-xl text-center font-medium transition"
          >
            🔍 Explorer les animes
          </a>

          <a
            href="/favorites"
            className="bg-white shadow hover:bg-orange-50 text-orange-600 px-5 py-3 rounded-xl text-center font-medium transition"
          >
            💾 Voir mes favoris
          </a>

          <a
            href="/seen"
            className="bg-white shadow hover:bg-green-50 text-green-600 px-5 py-3 rounded-xl text-center font-medium transition"
          >
            ✅ Mes animes vus
          </a>

          <a
            href="/quiz"
            className="bg-white shadow hover:bg-purple-50 text-purple-600 px-5 py-3 rounded-xl text-center font-medium transition"
          >
            🎮 Lancer le quiz
          </a>
        </div>

      </div>
    </div>
  )
}
