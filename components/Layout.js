import Link from "next/link"
import { useRouter } from "next/router"

const tabs = [
    { href: "/", label: "Accueil" },
    { href: "/explore", label: "Explorer" },
    { href: "/favorites", label: "Favoris" },
    { href: "/seen", label: "Vus" },
    { href: "/stats", label: "Stats" },
    { href: "/profile", label: "Profil" },
    { href: "/quiz", label: "Quizz" },
]

export default function Layout({ children }) {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Barre d’onglets */}
            <nav className="bg-white shadow p-4 flex gap-4 justify-center">
                {tabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`px-3 py-1 rounded-md font-medium text-sm transition ${router.pathname === tab.href
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>

            {/* Contenu principal */}
            <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
                {children}
            </main>
        </div>
    )
}
