import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function RecommendationPage() {
  const router = useRouter();
  const { mood } = router.query;
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mood) return;

    const fetchAnime = async () => {
      try {
        const res = await fetch('/api/recommend?mood=' + mood);
        const data = await res.json();
        setAnime(data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [mood]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!anime) return <div className="p-8">Aucun anime trouvé 😢</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ta recommandation pour l’humeur : {mood}</h1>
      <div className="border rounded-xl p-4 max-w-xl shadow-lg">
        <h2 className="text-xl font-semibold">{anime.title}</h2>
        <img src={anime.imageUrl} alt={anime.title} className="w-64 my-4" />
        <p className="text-gray-700">{anime.synopsis}</p>
      </div>
    </div>
  );
}