import { PrismaClient } from '@prisma/client'

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

export default function History({ recommendations }) {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Historique des recommandations</h1>
            {recommendations.length === 0 ? (
                <p>Aucune recommandation encore 😶</p>
            ) : (
                <div className="grid gap-4">
                    {recommendations.map((rec) => (
                        <div key={rec.id} className="border p-4 rounded-xl shadow">
                            <div className="flex gap-4 items-start">
                                <img src={rec.imageUrl} alt={rec.title} className="w-32 mt-2" />
                                <textarea
                                    defaultValue={rec.note || ""}
                                    placeholder="Ajouter une note perso..."
                                    className="w-full border rounded p-2 text-sm mt-2"
                                    onBlur={async (e) => {
                                        await fetch('/api/note', {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ id: rec.id, note: e.target.value }),
                                        });
                                    }}
                                />

                                <button
                                    onClick={async () => {
                                        const confirmed = confirm(`Supprimer ${rec.title} ?`);
                                        if (!confirmed) return;

                                        await fetch('/api/delete', {
                                            method: 'DELETE',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ id: rec.id }),
                                        });

                                        location.reload(); // recharger la page
                                    }}
                                    className="mt-2 text-red-500 underline text-sm"
                                >
                                    Supprimer
                                </button>

                                <div>
                                    <h2 className="text-xl font-semibold">{rec.title}</h2>
                                    <p className="text-sm text-gray-600">Humeur : {rec.mood}</p>
                                    <p className="text-sm text-gray-500">Reçu le : {rec.createdAt}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
