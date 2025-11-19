import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const { isCompleted, content } = await request.json()

        const todo = await prisma.todo.update({
            where: { id },
            data: { isCompleted, content },
        })
        return NextResponse.json(todo)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update todo" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        await prisma.todo.delete({
            where: { id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 })
    }
}
