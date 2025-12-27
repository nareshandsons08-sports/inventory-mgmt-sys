import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "New Sale",
}

export default function NewSaleLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
