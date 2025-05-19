
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { signIn } from "next-auth/react"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow text-center">
                <h1 className="text-2xl font-bold mb-4">Connexion</h1>
                <button
                    onClick={() => signIn("google")}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Se connecter avec Google
                </button>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login")
        }
    }, [status])

    if (status === "loading") return <p>Chargement...</p>
    if (!session) return null

    return (
        <div className="p-6">
            <h1 className="text-xl">Bienvenue {session.user.name}</h1>
            <p className="text-sm">{session.user.email}</p>
            <button onClick={() => signOut()} className="underline text-red-600">
                Se déconnecter
            </button>
        </div>
    )
}
