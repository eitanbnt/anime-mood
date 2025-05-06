import { useRouter } from 'next/router'

const moods = [
  { label: "Heureux", emoji: "😄" },
  { label: "Triste", emoji: "😢" },
  { label: "Nostalgique", emoji: "😔" },
  { label: "Énergique", emoji: "💪" },
  { label: "Amoureux", emoji: "😍" },
];

export default function Home() {
  const router = useRouter();

  const handleMoodClick = (mood) => {
    router.push('/recommendation?mood=' + mood);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quel est ton mood aujourd’hui ?</h1>
      <div className="flex gap-4 flex-wrap">
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => handleMoodClick(m.label)}
            className="text-3xl p-4 border rounded-xl hover:bg-gray-100"
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}