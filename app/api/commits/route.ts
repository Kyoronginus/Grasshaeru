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

        const commits = await prisma.commit.findMany({
            where: {
                // @ts-ignore
                userId: session.user.id
            },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(commits)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch commits" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { message } = await request.json()
        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        // Create commit linked to user
        const commit = await prisma.commit.create({
            data: {
                message,
                // @ts-ignore
                userId: session.user.id
            },
        })

        return NextResponse.json(commit)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create commit" }, { status: 500 })
    }
}
