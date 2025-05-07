import { useState } from "react"
import { PrismaClient } from "@prisma/client"

export async function getServerSideProps() {
    const prisma = new PrismaClient()
    const recommendations = await prisma.recommendation.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return {
        props: {
            recommendations: recommendations.map((rec) => ({
                ...rec,
                createdAt: new Date(rec.createdAt).toLocaleString(),
            }))
        }
    }
}

const moodStyle = {
    Heureux: { color: "bg-green-100", emoji: "😄" },
    Triste: { color: "bg-blue-100", emoji: "😢" },
    Nostalgique: { color: "bg-purple-100", emoji: "😔" },
    Énergique: { color: "bg-yellow-100", emoji: "💪" },
    Amoureux: { color: "bg-pink-100", emoji: "😍" },
}

export default function History({ recommendations }) {
    const [search, setSearch] = useState("")

    const filtered = recommendations.filter((rec) =>
        rec.title.toLowerCase().includes(search.toLowerCase()) ||
        rec.mood.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="max-w-3xl mx-auto p-6">
            <a href="/" className="inline-block mb-6 text-blue-600 underline">
                ← Retour à l’accueil
            </a>

            <h1 className="text-2xl font-bold mb-4">Historique des recommandations</h1>

            <input
                type="text"
                placeholder="Rechercher par titre ou humeur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded mb-6"
            />

            {filtered.length === 0 ? (
                <p>Aucun résultat 😶</p>
            ) : (
                <div className="grid gap-6">
                    {filtered.map((rec) => {
                        const style = moodStyle[rec.mood] || { color: "bg-gray-100", emoji: "🌀" }

                        return (
                            <div key={rec.id} className={`p-4 rounded-xl shadow ${style.color}`}>
                                <div className="flex items-start gap-4">
                                    <img src={rec.imageUrl} alt={rec.title} className="w-24 rounded" />
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold flex items-center gap-2">
                                            {style.emoji} {rec.title}
                                        </h2>
                                        <p className="text-sm text-gray-600">Humeur : {rec.mood}</p>
                                        <p className="text-sm text-gray-500 mb-2">Date : {rec.createdAt}</p>

                                        <textarea
                                            defaultValue={rec.note || ""}
                                            placeholder="Ajouter une note..."
                                            className="w-full border rounded p-2 text-sm mb-2"
                                            onBlur={async (e) => {
                                                await fetch('/api/note', {
                                                    method: 'PATCH',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ id: rec.id, note: e.target.value }),
                                                })
                                            }}
                                        />

                                        <button
                                            onClick={async () => {
                                                const confirmed = confirm(`Supprimer ${rec.title} ?`)
                                                if (!confirmed) return

                                                await fetch('/api/delete', {
                                                    method: 'DELETE',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ id: rec.id }),
                                                })

                                                location.reload()
                                            }}
                                            className="text-red-500 text-sm underline"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
