import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

const moods = {
  Heureux: { color: "bg-green-100", emoji: "😄" },
  Triste: { color: "bg-blue-100", emoji: "😢" },
  Nostalgique: { color: "bg-purple-100", emoji: "🕰️" },
  Énergique: { color: "bg-red-100", emoji: "💥" },
  Amoureux: { color: "bg-pink-100", emoji: "❤️" },
  Calme: { color: "bg-gray-100", emoji: "😌" },
  "Mind-blowing": { color: "bg-indigo-100", emoji: "🤯" },
  "À pleurer": { color: "bg-blue-200", emoji: "😭" },
  Délirant: { color: "bg-yellow-100", emoji: "🤪" },
  "Feel-good": { color: "bg-orange-100", emoji: "☀️" }
}

export default function Home() {
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

  const handleMoodClick = (mood) => {
    router.replace('/recommendation?mood=' + mood)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <a href="/profile" className="text-sm underline text-gray-600 mt-4">👤 Mon profil</a>
      <h1 className="text-3xl font-bold mb-6 text-center">Quel est ton mood aujourd’hui ?</h1>
      <div className="flex gap-4 flex-wrap justify-center">
        {Object.entries(moods).map(([mood, info]) => (
          <button
            key={mood}
            onClick={() => handleMoodClick(mood)}
            className={`px-4 py-2 rounded shadow ${info.color} hover:opacity-90 transition`}
          >
            {info.emoji} {mood}
          </button>
        ))}
      </div>


      <a href="/history" className="mt-10 text-blue-600 underline text-sm">
        Voir l’historique des recommandations →
      </a>
      <a href="/favorites" className="mt-4 text-sm text-blue-500 underline">Voir mes favoris →</a>
      <a
        href="/quiz"
        className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition mt-4"
      >
        🎮 Lancer le quiz d’humeur
      </a>
    </div>
  )
}
