export default function Admin() {
    const updateCache = async () => {
        const res = await fetch("/api/update-cache", { method: "POST" })
        const result = await res.json()
        alert(`Base mise à jour avec ${result.count} animes ✅`)
    }

    return (
        <div className="p-6">
            <a href="/" className="text-blue-600 underline mb-4 block">← Retour à l’accueil</a>

            <h1 className="text-2xl font-bold mb-4">🛠 Panel admin</h1>

            <button
                onClick={updateCache}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                🔁 Mettre à jour la base anime
            </button>
        </div>
    )
}
