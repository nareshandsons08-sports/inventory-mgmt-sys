import { Plus } from "lucide-react"
import Link from "next/link"

import { getTransactions } from "@/actions/transaction"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { PurchaseList } from "./_components/purchase-list"

interface PurchasesPageProps {
    searchParams: Promise<{ page?: string }>
}

export default async function PurchasesPage({ searchParams }: PurchasesPageProps) {
    const session = await auth()
    const role = session?.user?.role
    const canManage = role === "ADMIN" || role === "MANAGER"

    const params = await searchParams
    const page = Number(params.page) || 1
    const { data: purchases, metadata } = await getTransactions("PURCHASE", page)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
                {canManage && (
                    <Link href="/purchases/new">
                        <Button className="gap-2 cursor-pointer">
                            <Plus className="h-4 w-4" />
                            Record Purchase
                        </Button>
                    </Link>
                )}
            </div>

            <PurchaseList purchases={purchases} metadata={metadata} />
        </div>
    )
}
