"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { cacheTag, cacheLife } from "next/cache"

const transactionItemSchema = z.object({
    productId: z.string(),
    quantity: z.coerce.number().int().positive(),
    price: z.coerce.number().min(0),
})

const transactionSchema = z.object({
    type: z.enum(["SALE", "PURCHASE"]),
    items: z.array(transactionItemSchema).min(1),
    userId: z.string().optional(), // In real app, get from session
})

export async function createTransaction(data: {
    type: "SALE" | "PURCHASE"
    items: { productId: string; quantity: number; price: number }[]
}) {
    const validatedData = transactionSchema.safeParse(data)

    if (!validatedData.success) {
        return { error: "Invalid data" }
    }

    const { type, items } = validatedData.data
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

    // TODO: Get actual user ID from session
    // For now, we'll fetch the first admin user or use a placeholder
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } })
    const userId = adminUser?.id || "placeholder-user-id"

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create Transaction
            const transaction = await tx.transaction.create({
                data: {
                    type,
                    total,
                    userId,
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            })

            // 2. Update Product Stock
            for (const item of items) {
                const qtyChange = type === "PURCHASE" ? item.quantity : -item.quantity

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQty: {
                            increment: qtyChange,
                        },
                    },
                })
                // Invalidate individual product cache if needed, but 'products' tag covers list
            }
        })
    } catch (error) {
        console.error("Transaction failed:", error)
        return { error: "Transaction failed" }
    }

    revalidateTag("transactions")
    revalidateTag("products") // Stock changes, so invalidate products too
    revalidateTag("reports") // Sales/purchases change reports

    revalidatePath("/products")
    revalidatePath("/purchases")
    revalidatePath("/sales")

    if (type === "PURCHASE") redirect("/purchases")
    if (type === "SALE") redirect("/sales")
}

import { serializePrisma } from "@/lib/prisma-utils"
import type { Transaction } from "@/types"

// ... (createTransaction function)

export async function getTransactions(type: "SALE" | "PURCHASE"): Promise<Transaction[]> {
    "use cache"
    cacheTag("transactions", type.toLowerCase())
    cacheLife("minutes")

    const transactions = await prisma.transaction.findMany({
        where: { type },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: { date: "desc" },
    })
    return serializePrisma(transactions)
}
