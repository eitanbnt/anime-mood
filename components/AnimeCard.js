// components/AnimeCard.js

import React from "react"

/**
 * Composant qui affiche une carte d'anime avec infos principales
 * @param {Object} anime - Données de l'anime
 */
export default function AnimeCard({ anime, onSeen, onFavorite }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">{anime.title}</h2>
            <img
                src={anime.imageUrl}
                alt={anime.title}
                className="rounded mb-2 max-h-56 object-cover w-full"
            />
            <p className="text-sm text-gray-600 mb-1">
                Genres : {(anime.genres || []).join(", ")}
            </p>
            <p className="text-sm text-gray-500 mb-3">
                {anime.synopsis?.slice(0, 120)}...
            </p>

            <div className="flex gap-4 text-sm">
                <button
                    onClick={() => onSeen(anime.animeId)}
                    className="underline text-green-600"
                >
                    ✅ Déjà vu
                </button>
                <button
                    onClick={() => onFavorite(anime.animeId)}
                    className="underline text-orange-600"
                >
                    💾 Favori
                </button>
            </div>
        </div>
    )
}
