"use server"

import type { Prisma } from "@prisma/client"
import { cacheLife, cacheTag, revalidateTag } from "next/cache"
import { prisma } from "@/lib/prisma"
import type {
    CustomerStats,
    EntitySummary,
    LowStockReportItem,
    ProfitLossSummary,
    PurchaseSummary,
    SalesHistoryItem,
    SupplierStats,
    TopProductItem,
    ValuationReport,
} from "@/types"

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

export async function getSalesHistory(): Promise<SalesHistoryItem[]> {
    "use cache"
    cacheTag("reports", "sales-history")
    cacheLife("minutes")

    const include = {
        user: {
            select: {
                name: true,
                email: true,
            },
        },
        items: {
            include: {
                product: {
                    select: {
                        name: true,
                    },
                },
            },
        },
    } satisfies Prisma.TransactionInclude

    const transactions = await prisma.transaction.findMany({
        where: {
            type: "SALE",
        },
        include,
        orderBy: {
            date: "desc",
        },
        take: 50,
    })

    // Explicitly define the expected structure to avoid 'any' and handle stale Prisma types
    interface TransactionWithRelations {
        id: string
        date: Date
        total: Prisma.Decimal
        user: { name: string | null; email: string | null } | null
        items: {
            id: string
            quantity: number
            product: { name: string } | null
        }[]
    }

    // Cast the result to the explicit structure.
    // This is safe because the db query above ensures this shape, even if local Prisma types are stale.
    const safeTransactions = transactions as unknown as TransactionWithRelations[]

    return safeTransactions.map((t) => ({
        id: t.id,
        date: t.date,
        total: Number(t.total),
        user: t.user,
        items: t.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            product: {
                name: i.product?.name || "Unknown",
            },
        })),
    }))
}

// Calculate Profit & Loss based on SALES transactions
export async function getProfitLossReport(startDate?: Date, endDate?: Date): Promise<ProfitLossSummary> {
    "use cache"
    cacheTag("reports", "profit-loss")
    cacheLife("minutes")

    const where: Prisma.TransactionWhereInput = {
        type: "SALE",
        ...(startDate && endDate
            ? {
                  date: {
                      gte: startDate,
                      lte: endDate,
                  },
              }
            : {}),
    }

    const sales = await prisma.transaction.findMany({
        where,
        include: {
            items: {
                include: {
                    product: { select: { costPrice: true } },
                },
            },
        },
    })

    let totalRevenue = 0
    let totalCostOfGoodsSold = 0

    for (const sale of sales) {
        totalRevenue += Number(sale.total)

        for (const item of sale.items) {
            // Use current product cost since historical cost snapshot is not available on TransactionItem
            const itemCost = Number(item.product.costPrice)
            totalCostOfGoodsSold += itemCost * item.quantity
        }
    }

    return {
        totalRevenue,
        totalCostOfGoodsSold,
        grossProfit: totalRevenue - totalCostOfGoodsSold,
        transactionCount: sales.length,
    }
}

export async function getTopSellingProducts(limit = 10): Promise<TopProductItem[]> {
    "use cache"
    cacheTag("reports", "top-selling")
    cacheLife("minutes")

    const items = await prisma.transactionItem.findMany({
        where: {
            transaction: { type: "SALE" },
        },
        select: {
            productId: true,
            quantity: true,
            price: true,
            discount: true,
            product: {
                select: {
                    name: true,
                    sku: true,
                },
            },
        },
    })

    const productMap = new Map<string, TopProductItem>()

    for (const item of items) {
        const existing = productMap.get(item.productId)
        const lineRevenue = item.quantity * Number(item.price) - Number(item.discount || 0)

        if (existing) {
            existing.quantitySold += item.quantity
            existing.revenue += lineRevenue
        } else {
            productMap.set(item.productId, {
                id: item.productId,
                name: item.product?.name || "Unknown",
                sku: item.product?.sku || "-",
                quantitySold: item.quantity,
                revenue: lineRevenue,
            })
        }
    }

    return Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit)
}

// --- NEW REPORTS ---

export async function refreshReportData() {
    revalidateTag("reports", "max")
}

export async function getSupplierStats(limit = 10): Promise<SupplierStats[]> {
    "use cache"
    cacheTag("reports", "suppliers")
    cacheLife("minutes")

    const grouped = await prisma.transaction.groupBy({
        by: ["supplierId"],
        where: {
            type: "PURCHASE",
            supplierId: { not: null },
        },
        _sum: {
            total: true,
        },
        _count: {
            id: true,
        },
        orderBy: {
            _sum: {
                total: "desc",
            },
        },
        take: limit,
    })

    const supplierIds = grouped.map((g) => g.supplierId).filter((id): id is string => id !== null)

    const suppliers = await prisma.supplier.findMany({
        where: {
            id: { in: supplierIds },
        },
        select: {
            id: true,
            name: true,
        },
    })

    const supplierMap = new Map(suppliers.map((s) => [s.id, s.name]))

    return grouped.reduce<SupplierStats[]>((acc, g) => {
        if (g.supplierId) {
            acc.push({
                id: g.supplierId,
                name: supplierMap.get(g.supplierId) || "Unknown",
                totalPurchased: Number(g._sum.total || 0),
                transactionCount: g._count.id,
            })
        }
        return acc
    }, [])
}

export async function getCustomerStats(limit = 10): Promise<CustomerStats[]> {
    "use cache"
    cacheTag("reports", "customers")
    cacheLife("minutes")

    const grouped = await prisma.transaction.groupBy({
        by: ["customerId"],
        where: {
            type: "SALE",
            customerId: { not: null },
        },
        _sum: {
            total: true,
        },
        _count: {
            id: true,
        },
        orderBy: {
            _sum: {
                total: "desc",
            },
        },
        take: limit,
    })

    const customerIds = grouped.map((g) => g.customerId).filter((id): id is string => id !== null)

    const customers = await prisma.customer.findMany({
        where: {
            id: { in: customerIds },
        },
        select: {
            id: true,
            name: true,
        },
    })

    const customerMap = new Map(customers.map((c) => [c.id, c.name]))

    return grouped.reduce<CustomerStats[]>((acc, g) => {
        if (g.customerId) {
            acc.push({
                id: g.customerId,
                name: customerMap.get(g.customerId) || "Unknown",
                totalSpent: Number(g._sum.total || 0),
                visitCount: g._count.id,
            })
        }
        return acc
    }, [])
}

export async function getPurchaseHistory(): Promise<SalesHistoryItem[]> {
    "use cache"
    cacheTag("reports", "purchase-history")
    cacheLife("minutes")

    const transactions = await prisma.transaction.findMany({
        where: { type: "PURCHASE" },
        include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: { select: { name: true } } } },
            supplier: true,
        },
        orderBy: { date: "desc" },
        take: 50,
    })
    // Reuse SalesHistoryItem structure for simplicity or create new type if needed
    // SalesHistoryItem keys: id, date, total, user, items
    // We can map it similarly.
    return transactions.map((t) => ({
        id: t.id,
        date: t.date,
        total: Number(t.total),
        user: t.user,
        items: t.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            product: {
                name: i.product?.name || "Unknown",
            },
        })),
        // Add supplier info if needed in UI, but SalesHistoryItem might not have it.
        // For now, let's stick to the interface.
    }))
}

// --- INSIGHTS & SUMMARIES ---

export async function getPurchaseSummary(): Promise<PurchaseSummary> {
    "use cache"
    cacheTag("reports", "purchases-summary")
    cacheLife("minutes")

    const aggregate = await prisma.transaction.aggregate({
        where: { type: "PURCHASE" },
        _sum: { total: true },
        _count: { id: true },
    })

    const totalSpend = Number(aggregate._sum.total || 0)
    const count = aggregate._count.id

    return {
        totalSpend,
        count,
        avgValue: count > 0 ? totalSpend / count : 0,
    }
}

export async function getSupplierSummary(): Promise<EntitySummary> {
    "use cache"
    cacheTag("reports", "suppliers-summary")
    cacheLife("minutes")

    const [totalCount, activeCount, topSupplier] = await Promise.all([
        prisma.supplier.count(),
        prisma.transaction
            .groupBy({
                by: ["supplierId"],
                where: { type: "PURCHASE", supplierId: { not: null } },
            })
            .then((res) => res.length),
        prisma.transaction.groupBy({
            by: ["supplierId"],
            where: { type: "PURCHASE", supplierId: { not: null } },
            _sum: { total: true },
            orderBy: { _sum: { total: "desc" } },
            take: 1,
        }),
    ])

    let topName = "-"
    if (topSupplier.length > 0 && topSupplier[0].supplierId) {
        const s = await prisma.supplier.findUnique({
            where: { id: topSupplier[0].supplierId },
            select: { name: true },
        })
        topName = s?.name || "Unknown"
    }

    return {
        totalCount,
        activeCount,
        topPerformerName: topName,
        topPerformerValue: Number(topSupplier[0]?._sum.total || 0),
    }
}

export async function getCustomerSummary(): Promise<EntitySummary> {
    "use cache"
    cacheTag("reports", "customers-summary")
    cacheLife("minutes")

    const [totalCount, activeCount, topCustomer] = await Promise.all([
        prisma.customer.count(),
        prisma.transaction
            .groupBy({
                by: ["customerId"],
                where: { type: "SALE", customerId: { not: null } },
            })
            .then((res) => res.length),
        prisma.transaction.groupBy({
            by: ["customerId"],
            where: { type: "SALE", customerId: { not: null } },
            _sum: { total: true },
            orderBy: { _sum: { total: "desc" } },
            take: 1,
        }),
    ])

    let topName = "-"
    if (topCustomer.length > 0 && topCustomer[0].customerId) {
        const c = await prisma.customer.findUnique({
            where: { id: topCustomer[0].customerId },
            select: { name: true },
        })
        topName = c?.name || "Unknown"
    }

    return {
        totalCount,
        activeCount,
        topPerformerName: topName,
        topPerformerValue: Number(topCustomer[0]?._sum.total || 0),
    }
}
