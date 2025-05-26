import { useRouter } from "next/router"
import { useEffect, useState } from "react"

// 🎨 Dictionnaire pour couleurs + emojis par mood
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

  // Vérification de l'authentification
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
        Salut {username || "!"} 👋 <br /> Quel est ton mood aujourd’hui ?
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
    </div>
  )
}
