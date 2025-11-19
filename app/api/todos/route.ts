import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const todos = await prisma.todo.findMany({
            where: {
                // @ts-ignore
                userId: session.user.id
            },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(todos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { content } = await request.json()
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }
        const todo = await prisma.todo.create({
            data: {
                content,
                // @ts-ignore
                userId: session.user.id
            },
        })
        return NextResponse.json(todo)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
    }
}
