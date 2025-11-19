"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Palette } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            if (res.ok) {
                router.push("/login")
            } else {
                const data = await res.json()
                setError(data.error || "Registration failed")
            }
        } catch (error) {
            setError("An error occurred")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-zinc-100 p-4">
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                        <Palette className="text-purple-500" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Join Grasshaeru
                    </h1>
                    <p className="text-zinc-500 mt-2">Start your artistic journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-zinc-100"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-zinc-100"
                            placeholder="Choose a password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg border border-red-900/50">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors mt-2"
                    >
                        Create Account
                    </button>

                    <p className="text-xs text-center text-zinc-500 mt-4">
                        Already have an account?{" "}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
