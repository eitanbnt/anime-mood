import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function TranslateSynopsis({ original }) {
  const [translated, setTranslated] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTranslate = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://translate.argosopentech.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: original,
          source: "en",
          target: "fr",
          format: "text",
        }),
      })
      const data = await res.json()
      setTranslated(data.translatedText)
    } catch (err) {
      setTranslated("❌ Erreur de traduction")
    } finally {
      setLoading(false)
    }
  }

  if (translated) return <p className="text-sm text-gray-700">{translated}</p>

  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{original}</p>
      <button
        onClick={handleTranslate}
        className="text-sm text-blue-600 underline"
        disabled={loading}
      >
        {loading ? "Traduction..." : "📄 Traduire le synopsis"}
      </button>
    </div>
  )
}


export default function RecommendationPage() {
  const router = useRouter()
  const { mood } = router.query
  const [animes, setAnimes] = useState([])
  const [loading, setLoading] = useState(true)


  const fetchRecommendations = async () => {
    setLoading(true)
  
    let userId = localStorage.getItem('animeUserId')
    if (!userId) {
      userId = crypto.randomUUID()
      localStorage.setItem('animeUserId', userId)
    }
  
    try {
      const res = await fetch(`/api/recommend?mood=${mood}&userId=${userId}`)
      const data = await res.json()

      setAnimes(data) // 👈 remplacer l’ancien setAnimes(data)
    } catch (err) {
      console.error('Erreur de chargement :', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mood) fetchRecommendations()
  }, [mood])

  if (loading) return <div className="p-8">Chargement...</div>
  if (!animes.length) return <div className="p-8">Aucun anime trouvé 😢</div>

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <a href="/" className="inline-block mb-6 text-blue-600 underline">
        ← Retour à l’accueil
      </a>

      <h1 className="text-2xl font-bold mb-4">
        Recommandations pour l’humeur : {mood}
      </h1>

      <button
        onClick={fetchRecommendations}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        🔁 Recommander d'autres
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {animes.map((anime, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">{anime.title}</h2>
            <img src={anime.imageUrl} alt={anime.title} className="rounded mb-2" />
            {/* <p className="text-sm text-gray-700">{anime.synopsis}</p> */}
            <TranslateSynopsis original={anime.synopsis} />
          </div>
        ))}
      </div>
    </div>
  )
}
