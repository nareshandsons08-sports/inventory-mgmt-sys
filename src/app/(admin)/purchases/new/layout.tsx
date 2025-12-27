import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "New Purchase",
}

export default function NewPurchaseLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
