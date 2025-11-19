"use client"

import { useState } from "react"
import { TodoList } from "@/components/TodoList"
import { CommitGraph } from "@/components/CommitGraph"
import { Save, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [commitMessage, setCommitMessage] = useState("")
  const [isCommitting, setIsCommitting] = useState(false)

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-black text-zinc-500">Loading...</div>
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commitMessage.trim()) return

    setIsCommitting(true)
    try {
      await fetch("/api/commits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: commitMessage }),
      })
      setCommitMessage("")
      window.location.reload()
    } catch (error) {
      console.error("Failed to commit", error)
    } finally {
      setIsCommitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Grasshaeru
            </h1>
            <p className="text-zinc-500 mt-2 text-lg">
              Welcome back, <span className="text-zinc-300">{session?.user?.name}</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-end">
            <form onSubmit={handleCommit} className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Commit message..."
                className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-zinc-600"
              />
              <button
                type="submit"
                disabled={isCommitting}
                className="bg-zinc-100 text-black hover:bg-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {isCommitting ? "..." : "Commit"}
              </button>
            </form>

            <button
              onClick={() => signOut()}
              className="text-zinc-500 hover:text-zinc-300 flex items-center gap-2 text-sm"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <TodoList />
          </section>
          <section>
            <CommitGraph />
          </section>
        </div>
      </div>
    </main>
  )
}
