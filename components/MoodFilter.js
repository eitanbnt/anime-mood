// components/MoodFilter.js

/**
 * Affiche la liste des humeurs avec bouton de sélection
 */
export default function MoodFilter({ moods, selected, onSelect }) {
    return (
        <div className="mb-4">
            <h2 className="font-semibold mb-1">Humeurs :</h2>
            <div className="flex gap-2 flex-wrap">
                {moods.map((m) => (
                    <button
                        key={m}
                        onClick={() => onSelect(m)}
                        className={`px-3 py-1 rounded border ${selected === m ? "bg-pink-500 text-white" : "bg-white"
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>
    )
}
