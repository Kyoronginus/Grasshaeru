"use client"

import { useState, useEffect } from "react"
import { GitCommit } from "lucide-react"
import { cn } from "@/lib/utils"

interface Commit {
    id: string
    message: string
    createdAt: string
}

export function CommitGraph() {
    const [commits, setCommits] = useState<Commit[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchCommits()
    }, [])

    const fetchCommits = async () => {
        try {
            const res = await fetch("/api/commits")
            if (res.ok) {
                const data = await res.json()
                setCommits(data)
            }
        } catch (error) {
            console.error("Failed to fetch commits", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Generate last 365 days
    const days = Array.from({ length: 365 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (364 - i))
        return d
    })

    const getCommitCount = (date: Date) => {
        return commits.filter(c =>
            new Date(c.createdAt).toDateString() === date.toDateString()
        ).length
    }

    const getLevel = (count: number) => {
        if (count === 0) return 0
        if (count <= 2) return 1
        if (count <= 5) return 2
        if (count <= 10) return 3
        return 4
    }

    const getColor = (level: number) => {
        switch (level) {
            case 0: return "bg-zinc-800"
            case 1: return "bg-indigo-900"
            case 2: return "bg-indigo-700"
            case 3: return "bg-indigo-500"
            case 4: return "bg-indigo-300"
            default: return "bg-zinc-800"
        }
    }

    if (isLoading) {
        return <div className="text-center p-4 text-zinc-500">Loading contribution graph...</div>
    }

    return (
        <div className="w-full p-6 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-2">
                <GitCommit className="text-indigo-500" />
                Contributions
            </h2>

            <div className="flex flex-wrap gap-1 justify-center">
                {days.map((date, i) => {
                    const count = getCommitCount(date)
                    const level = getLevel(count)
                    return (
                        <div
                            key={i}
                            title={`${date.toDateString()}: ${count} commits`}
                            className={cn(
                                "w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer",
                                getColor(level)
                            )}
                        />
                    )
                })}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-zinc-500">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-zinc-800" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-900" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-700" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-300" />
                </div>
                <span>More</span>
            </div>
        </div>
    )
}
