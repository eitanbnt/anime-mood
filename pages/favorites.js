import { PrismaClient } from "@prisma/client"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"

export async function getServerSideProps() {
    const prisma = new PrismaClient()
    const all = await prisma.recommendation.findMany({
        where: { isFavorite: true },
        orderBy: { createdAt: 'desc' }
    })

    return {
        props: {
            allFavorites: all.map((r) => ({
                ...r,
                createdAt: new Date(r.createdAt).toLocaleString(),
            })),
        },
    }
}

export default function Favorites({ allFavorites }) {
    const router = useRouter(); // Assurez-vous que router est défini ici
    const [username, setUsername] = useState("");

    useEffect(() => {
        const check = () => {
            const saved = localStorage.getItem("animeUsername");
            if (!saved) {
                router.push("/login");
            } else {
                setUsername(saved);
            }
        };
        check();
    }, [router]);
    const [userFavorites, setUserFavorites] = useState([])

    useEffect(() => {
        let userId = localStorage.getItem("animeUsername")
        if (!userId) {
            userId = crypto.randomUUID()
            localStorage.setItem("animeUserId", userId)
        }
        if (!userId) return

        const filtered = allFavorites.filter((fav) => fav.userId === userId)
        setUserFavorites(filtered)
    }, [allFavorites])

    return (
        <div className="max-w-4xl mx-auto p-6">
            <a href="/" className="inline-block mb-6 text-blue-600 underline">
                ← Retour à l’accueil
            </a>

            <h1 className="text-2xl font-bold mb-4">💾 Tes favoris</h1>

            {userFavorites.length === 0 ? (
                <p>Aucun favori pour l’instant 💤</p>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {userFavorites.map((fav) => (
                        <div key={fav.id} className="bg-white rounded-xl p-4 shadow">
                            <h2 className="font-semibold text-lg mb-2">{fav.title}</h2>
                            <img src={fav.imageUrl} alt={fav.title} className="rounded mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Humeur : {fav.mood}</p>
                            <p className="text-sm text-gray-400">Ajouté le : {fav.createdAt}</p>
                            <button
                                onClick={async () => {
                                    const userId = localStorage.getItem("animeUsername")
                                    const animeId = fav.animeId || fav.malId
                                    if (!animeId || !userId) return alert("animeId ou userId manquant")

                                    const res = await fetch("/api/seen", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ animeId, userId })
                                    })

                                    const result = await res.json()
                                    console.log("✅ Réponse API :", result)
                                    alert("Marqué comme vu")
                                }}
                            >
                                ✅ Déjà vu
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
