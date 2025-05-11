// components/GenreFilter.js

/**
 * Affiche la liste des genres avec bouton de sélection
 */
export default function GenreFilter({ genres, selected, onSelect }) {
    return (
        <div className="mb-4">
            <h2 className="font-semibold mb-1">Genres :</h2>
            <div className="flex gap-2 flex-wrap">
                {genres.map((g) => (
                    <button
                        key={g}
                        onClick={() => onSelect(g)}
                        className={`px-3 py-1 rounded border ${selected === g ? "bg-blue-500 text-white" : "bg-white"
                            }`}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>
    )
}
