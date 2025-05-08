import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

const moods = [
  { label: "Heureux", emoji: "😄" },
  { label: "Triste", emoji: "😢" },
  { label: "Nostalgique", emoji: "😔" },
  { label: "Énergique", emoji: "💪" },
  { label: "Amoureux", emoji: "😍" },
]

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
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => handleMoodClick(m.label)}
            className="text-2xl px-6 py-3 bg-white shadow rounded-xl hover:bg-gray-100 transition"
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      <a href="/history" className="mt-10 text-blue-600 underline text-sm">
        Voir l’historique des recommandations →
      </a>
      <a href="/favorites" className="mt-4 text-sm text-blue-500 underline">Voir mes favoris →</a>
      <a href="/admin" className="mt-4 text-sm text-blue-500 underline">Page Admin</a>
    </div>
  )
}
