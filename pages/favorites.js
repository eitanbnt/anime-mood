import { PrismaClient } from "@prisma/client"
import { useEffect, useState } from "react"

const prisma = new PrismaClient()

export async function getServerSideProps(context) {
    // Pas de filtrage ici car le userId est dans le navigateur
    const recommendations = await prisma.recommendation.findMany({
        where: { isFavorite: true },
        orderBy: { createdAt: 'desc' }
    })

    return {
        props: {
            allFavorites: recommendations.map(r => ({
                ...r,
                createdAt: new Date(r.createdAt).toLocaleString()
            }))
        }
    }
}

export default function Favorites({ allFavorites }) {
    const [userFavorites, setUserFavorites] = useState([])

    useEffect(() => {
        const userId = localStorage.getItem("animeUserId")
        if (!userId) return
        const filtered = allFavorites.filter(f => f.userId === userId)
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
                    {userFavorites.map(fav => (
                        <div key={fav.id} className="bg-white rounded-xl p-4 shadow">
                            <h2 className="font-semibold text-lg mb-2">{fav.title}</h2>
                            <img src={fav.imageUrl} alt={fav.title} className="rounded mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Humeur : {fav.mood}</p>
                            <p className="text-sm text-gray-400">Ajouté le : {fav.createdAt}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
