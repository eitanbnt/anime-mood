import { useState } from "react"
import { useRouter } from "next/router"

const moodStyle = {
    Heureux: { color: "bg-green-100", emoji: "😄" },
    Triste: { color: "bg-blue-100", emoji: "😢" },
    Nostalgique: { color: "bg-purple-100", emoji: "🕰️" },
    Énergique: { color: "bg-red-100", emoji: "💥" },
    Amoureux: { color: "bg-pink-100", emoji: "❤️" },
    Calme: { color: "bg-gray-100", emoji: "😌" },
    "Mind-blowing": { color: "bg-indigo-100", emoji: "🤯" },
    "À pleurer": { color: "bg-blue-200", emoji: "😭" },
    Délirant: { color: "bg-yellow-100", emoji: "🤪" },
    "Feel-good": { color: "bg-orange-100", emoji: "☀️" },
}

const questions = [
    {
        question: "Quel genre de fin préfères-tu ?",
        options: {
            Heureux: "😄 Heureuse",
            Triste: "😢 Triste mais marquante",
            "Mind-blowing": "🤯 Inattendue",
        },
    },
    {
        question: "Quel rythme d’anime tu préfères ?",
        options: {
            Calme: "😌 Lent et contemplatif",
            Énergique: "💥 Rapide et intense",
            "Feel-good": "☀️ Positif et léger",
        },
    },
    {
        question: "Tu veux ressentir quoi après le visionnage ?",
        options: {
            "À pleurer": "😭 Émotions fortes",
            Délirant: "🤪 Délire total",
            Amoureux: "❤️ Un peu d’amour",
        },
    },
]

export default function QuizPage() {
    const [answers, setAnswers] = useState([])
    const [step, setStep] = useState(0)
    const [finalMood, setFinalMood] = useState(null)
    const router = useRouter()

    const handleSelect = (mood) => {
        const updated = [...answers, mood]
        setAnswers(updated)

        if (step + 1 < questions.length) {
            setStep(step + 1)
        } else {
            const tally = {}
            for (const m of updated) {
                tally[m] = (tally[m] || 0) + 1
            }
            const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
            setFinalMood(best)
        }
    }

    const goToRecommendation = () => {
        router.push(`/recommendation?mood=${encodeURIComponent(finalMood)}`)
    }

    const q = questions[step]

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <a href="/" className="absolute top-4 left-4 text-blue-600 underline">← Retour</a>

            <h1 className="text-2xl font-bold mb-6 text-center">🎯 Quiz d’humeur</h1>

            {finalMood ? (
                <div className={`p-6 rounded-xl shadow max-w-lg w-full text-center ${moodStyle[finalMood]?.color || "bg-gray-100"}`}>
                    <h2 className="text-xl font-semibold mb-4">
                        Ton humeur est : {moodStyle[finalMood]?.emoji || "🎭"} <span className="capitalize">{finalMood}</span>
                    </h2>
                    <p className="text-gray-700 mb-6">Voici les recommandations correspondant à ton mood.</p>
                    <button
                        onClick={goToRecommendation}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Voir les recommandations →
                    </button>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full text-center">
                    <p className="text-lg font-medium mb-2">{q.question}</p>
                    <p className="text-sm text-gray-500 mb-4">Question {step + 1} sur {questions.length}</p>
                    <div className="grid gap-4">
                        {Object.entries(q.options).map(([mood, label]) => (
                            <button
                                key={mood}
                                onClick={() => handleSelect(mood)}
                                className={`px-4 py-2 rounded font-medium transition ${moodStyle[mood]?.color || "bg-gray-100"} hover:scale-105`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
