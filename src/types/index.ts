// Re-export Prisma types if needed, or define frontend-safe versions

export interface Product {
    id: string
    sku: string
    name: string
    brand: string | null
    category: string | null
    description: string | null
    imageUrl: string | null
    barcode: string | null
    costPrice: number
    salePrice: number
    stockQty: number
    minStock: number
    isArchived: boolean
    createdAt: Date
    updatedAt: Date
}

export interface TransactionItem {
    id: string
    transactionId: string
    productId: string
    quantity: number
    price: number
    product?: Product
}

export interface Transaction {
    id: string
    type: "SALE" | "PURCHASE"
    date: Date
    total: number
    userId: string
    items: TransactionItem[]
}

// ... types
export interface Adjustment {
    id: string
    productId: string
    userId: string
    reason: string
    qtyChange: number
    createdAt: Date
    product?: Product
}

export interface ActionState {
    error?: string
    success?: string
    issues?: {
        message: string
        path: (string | number)[]
    }[]
    data?: unknown // Optional data return
}
