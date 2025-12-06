"use server"

import { prisma } from "@/lib/prisma"
import { cacheTag, cacheLife } from "next/cache"

export type LowStockReportItem = {
    id: string
    sku: string
    name: string
    stockQty: number
    minStock: number
}

export async function getLowStockReport(): Promise<LowStockReportItem[]> {
    "use cache"
    cacheTag("reports", "low-stock-report")
    cacheLife("minutes")

    const products = await prisma.product.findMany({
        where: {
            stockQty: {
                lte: prisma.product.fields.minStock,
            },
            isArchived: false,
        },
        orderBy: {
            stockQty: "asc",
        },
        select: {
            id: true,
            sku: true,
            name: true,
            stockQty: true,
            minStock: true,
        },
    })
    return products
}

export type ValuationReport = {
    params: {
        totalCost: number
        totalRetail: number
        itemCount: number
    }
    products: {
        id: string
        sku: string
        name: string
        stockQty: number
        costPrice: number
        salePrice: number
    }[]
}

export async function getInventoryValuation(): Promise<ValuationReport> {
    "use cache"
    cacheTag("reports", "inventory-valuation")
    cacheLife("minutes")

    const products = await prisma.product.findMany({
        where: {
            isArchived: false,
        },
        select: {
            id: true,
            name: true,
            sku: true,
            stockQty: true,
            costPrice: true,
            salePrice: true,
        },
    })

    const valuation = products.reduce(
        (acc, product) => {
            const qty = product.stockQty
            const cost = Number(product.costPrice)
            const sale = Number(product.salePrice)

            return {
                totalCost: acc.totalCost + qty * cost,
                totalRetail: acc.totalRetail + qty * sale,
                itemCount: acc.itemCount + qty,
            }
        },
        { totalCost: 0, totalRetail: 0, itemCount: 0 }
    )

    return {
        params: valuation,
        products: products.map((p) => ({
            ...p,
            costPrice: Number(p.costPrice),
            salePrice: Number(p.salePrice),
        })),
    }
}

export type SalesHistoryItem = {
    id: string
    date: Date
    total: number
    items: {
        id: string
        quantity: number
        product: {
            name: string
        }
    }[]
}

export async function getSalesHistory(): Promise<SalesHistoryItem[]> {
    "use cache"
    cacheTag("reports", "sales-history")
    cacheLife("minutes")

    const transactions = await prisma.transaction.findMany({
        where: {
            type: "SALE",
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            date: "desc",
        },
        take: 50,
    })

    return transactions.map((t) => ({
        id: t.id,
        date: t.date,
        total: Number(t.total),
        items: t.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            product: {
                name: i.product.name,
            },
        })),
    }))
}
