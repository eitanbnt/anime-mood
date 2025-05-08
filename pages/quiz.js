import { useState } from "react"
import { useRouter } from "next/router"

const questions = [
    {
        text: "🌤 Quelle météo te donne le plus envie de regarder un anime ?",
        options: [
            { label: "☀️ Soleil", moods: ["Énergique", "Heureux"] },
            { label: "🌧 Pluie", moods: ["Triste", "Nostalgique"] },
            { label: "❄️ Neige", moods: ["Calme", "Nostalgique"] }
        ]
    },
    {
        text: "🧠 Comment tu te sens en ce moment ?",
        options: [
            { label: "😄 Souriant", moods: ["Heureux"] },
            { label: "💤 Fatigué", moods: ["Calme", "Nostalgique"] },
            { label: "😢 Sensible", moods: ["Triste"] }
        ]
    },
    {
        text: "🎬 Tu veux voir un anime qui...",
        options: [
            { label: "💥 Bouge dans tous les sens", moods: ["Énergique"] },
            { label: "❤️ Touche le cœur", moods: ["Amoureux", "Nostalgique"] },
            { label: "😭 Fait pleurer", moods: ["Triste"] }
        ]
    }
]

export default function QuizPage() {
    const [answers, setAnswers] = useState(Array(questions.length).fill(null))
    const [submitted, setSubmitted] = useState(false)
    const router = useRouter()

    const handleAnswer = (qIndex, moods) => {
        const copy = [...answers]
        copy[qIndex] = moods
        setAnswers(copy)
    }

    const calculateMood = () => {
        const score = {}
        answers.forEach(moodList => {
            moodList?.forEach(m => {
                score[m] = (score[m] || 0) + 1
            })
        })

        const max = Math.max(...Object.values(score))
        const bestMoods = Object.entries(score)
            .filter(([_, val]) => val === max)
            .map(([m]) => m)

        const selected = bestMoods[Math.floor(Math.random() * bestMoods.length)]
        return selected
    }

    const handleSubmit = () => {
        if (answers.includes(null)) {
            alert("⛔ Réponds à toutes les questions !")
            return
        }

        const finalMood = calculateMood()
        router.push(`/recommendation?mood=${encodeURIComponent(finalMood)}`)
    }

    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50">
            <a href="/" className="text-blue-600 underline block mb-4">← Retour à l’accueil</a>
            <h1 className="text-2xl font-bold mb-6">🎮 Quel est ton mood anime aujourd’hui ?</h1>

            {questions.map((q, index) => (
                <div key={index} className="mb-6">
                    <p className="font-medium mb-2">{q.text}</p>
                    <div className="space-y-1">
                        {q.options.map((opt, i) => (
                            <label key={i} className="block cursor-pointer">
                                <input
                                    type="radio"
                                    name={`q${index}`}
                                    className="mr-2"
                                    onChange={() => handleAnswer(index, opt.moods)}
                                    checked={answers[index] === opt.moods}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                🎯 Voir ma recommandation
            </button>
        </div>
    )
}
