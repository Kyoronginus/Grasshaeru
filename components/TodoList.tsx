"use client"

import { useState, useEffect } from "react"
import { Trash2, Check, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Todo {
    id: string
    content: string
    isCompleted: boolean
    createdAt: string
}

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTodo, setNewTodo] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTodos()
    }, [])

    const fetchTodos = async () => {
        try {
            const res = await fetch("/api/todos")
            const data = await res.json()
            setTodos(data)
        } catch (error) {
            console.error("Failed to fetch todos", error)
        } finally {
            setIsLoading(false)
        }
    }

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTodo.trim()) return

        try {
            const res = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newTodo }),
            })
            const todo = await res.json()
            setTodos([todo, ...todos])
            setNewTodo("")
        } catch (error) {
            console.error("Failed to add todo", error)
        }
    }

    const toggleTodo = async (id: string, isCompleted: boolean) => {
        try {
            // Optimistic update
            setTodos(todos.map(t => t.id === id ? { ...t, isCompleted: !isCompleted } : t))

            await fetch(`/api/todos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isCompleted: !isCompleted }),
            })
        } catch (error) {
            console.error("Failed to toggle todo", error)
            fetchTodos() // Revert on error
        }
    }

    const deleteTodo = async (id: string) => {
        try {
            setTodos(todos.filter(t => t.id !== id))
            await fetch(`/api/todos/${id}`, {
                method: "DELETE",
            })
        } catch (error) {
            console.error("Failed to delete todo", error)
            fetchTodos()
        }
    }

    if (isLoading) {
        return <div className="text-center p-4">Loading tasks...</div>
    }

    return (
        <div className="w-full max-w-md mx-auto p-4 bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-zinc-100">Tasks</h2>

            <form onSubmit={addTodo} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 bg-zinc-800 text-zinc-100 border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-zinc-500"
                />
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
                >
                    <Plus size={24} />
                </button>
            </form>

            <div className="space-y-3">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className={cn(
                            "group flex items-center justify-between p-3 rounded-lg border transition-all",
                            todo.isCompleted
                                ? "bg-zinc-900/50 border-zinc-800 opacity-60"
                                : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                        )}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <button
                                onClick={() => toggleTodo(todo.id, todo.isCompleted)}
                                className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                    todo.isCompleted
                                        ? "bg-green-500 border-green-500"
                                        : "border-zinc-500 hover:border-zinc-400"
                                )}
                            >
                                {todo.isCompleted && <Check size={14} className="text-white" />}
                            </button>
                            <span
                                className={cn(
                                    "text-sm font-medium transition-all",
                                    todo.isCompleted ? "text-zinc-500 line-through" : "text-zinc-100"
                                )}
                            >
                                {todo.content}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                {todos.length === 0 && (
                    <div className="text-center text-zinc-500 py-8">
                        No tasks yet. Start creating!
                    </div>
                )}
            </div>
        </div>
    )
}
