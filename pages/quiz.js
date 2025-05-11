import { useState } from "react"
import { useRouter } from "next/router"

const questions = [
    {
        question: "Quel genre de fin préfères-tu ?",
        options: {
            "Heureux": "😄 Heureuse",
            "Triste": "😢 Triste mais marquante",
            "Mind-blowing": "🤯 Inattendue",
        },
    },
    {
        question: "Quel rythme d’anime tu préfères ?",
        options: {
            "Calme": "😌 Lent et contemplatif",
            "Énergique": "💥 Rapide et intense",
            "Feel-good": "☀️ Positif et léger",
        },
    },
    {
        question: "Tu veux ressentir quoi après le visionnage ?",
        options: {
            "À pleurer": "😭 Émotions fortes",
            "Délirant": "🤪 Délire total",
            "Amoureux": "❤️ Un peu d’amour",
        },
    },
]

export default function QuizPage() {
    const [answers, setAnswers] = useState([])
    const [step, setStep] = useState(0)
    const router = useRouter()

    const handleSelect = (mood) => {
        setAnswers([...answers, mood])
        if (step + 1 < questions.length) {
            setStep(step + 1)
        } else {
            // 🔮 choisir le mood le plus fréquent
            const tally = {}
            for (const m of [...answers, mood]) {
                tally[m] = (tally[m] || 0) + 1
            }
            const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
            router.push(`/recommendation?mood=${encodeURIComponent(best)}`)
        }
    }

    const q = questions[step]

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <a href="/" className="absolute top-4 left-4 text-blue-600 underline">← Retour</a>

            <h1 className="text-xl font-bold mb-6 text-center">🎯 Quiz d’humeur</h1>

            <div className="bg-white p-6 rounded-xl shadow max-w-lg w-full text-center">
                <p className="text-lg font-medium mb-4">{q.question}</p>
                <div className="grid gap-4">
                    {Object.entries(q.options).map(([mood, label]) => (
                        <button
                            key={mood}
                            onClick={() => handleSelect(mood)}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
