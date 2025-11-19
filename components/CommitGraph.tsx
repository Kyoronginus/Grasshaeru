"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Todo {
	    id: string
	    isCompleted: boolean
	    createdAt: string
	    updatedAt?: string
}

// This component keeps the same name so that app/page.tsx
// doesn't need to change, but it now shows a task completion table
// similar to the GitHub contribution grid.
export function CommitGraph() {
	    const [todos, setTodos] = useState<Todo[]>([])
	    const [isLoading, setIsLoading] = useState(true)

	    useEffect(() => {
	        const fetchTodos = async () => {
	            try {
	                const res = await fetch("/api/todos")
	                if (res.ok) {
	                    const data = await res.json()
	                    setTodos(data)
	                }
	            } catch (error) {
	                console.error("Failed to fetch todos", error)
	            } finally {
	                setIsLoading(false)
	            }
	        }

	        fetchTodos()
	    }, [])

	    // Generate last 365 days
	    const days = Array.from({ length: 365 }, (_, i) => {
	        const d = new Date()
	        d.setDate(d.getDate() - (364 - i))
	        return d
	    })

	    // Group days into weeks for a GitHub‑style grid
	    const weeks: Date[][] = []
	    for (let i = 0; i < days.length; i += 7) {
	        weeks.push(days.slice(i, i + 7))
	    }

	    const getCompletedCountForDate = (date: Date) => {
	        return todos.filter(t => {
	            if (!t.isCompleted) return false
	            const completedAt = new Date(t.updatedAt ?? t.createdAt)
	            return completedAt.toDateString() === date.toDateString()
	        }).length
	    }

	    if (isLoading) {
	        return <div className="text-center p-4 text-zinc-500">Loading task table...</div>
	    }

	    const dayLabels = ["Mon", "Wed", "Fri"]

	    return (
	        <div className="w-full p-6 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800">
	            <h2 className="text-2xl font-bold mb-6 text-zinc-100">Task completion</h2>

	            <div className="flex">
	                <div className="flex flex-col justify-between mr-3 text-xs text-zinc-500">
	                    {dayLabels.map(label => (
	                        <span key={label}>{label}</span>
	                    ))}
	                </div>
	                <div className="flex gap-1 overflow-x-auto">
	                    {weeks.map((week, weekIndex) => (
	                        <div key={weekIndex} className="flex flex-col gap-1">
	                            {week.map((date, dayIndex) => {
	                                const count = getCompletedCountForDate(date)
	                                const hasCompleted = count > 0
	                                return (
	                                    <div
	                                        key={`${weekIndex}-${dayIndex}`}
	                                        title={`${date.toDateString()}: ${count} task${count === 1 ? "" : "s"} completed`}
	                                        className={cn(
	                                            "w-3 h-3 rounded-sm transition-all",
	                                            hasCompleted ? "bg-green-500" : "bg-zinc-800"
	                                        )}
	                                    />
	                                )
	                            })}
	                        </div>
	                    ))}
	                </div>
	            </div>
	        </div>
	    )
}
