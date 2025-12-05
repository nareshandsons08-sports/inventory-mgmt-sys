import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Sports Shop IMS",
    description: "Inventory Management System",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex h-screen w-full overflow-hidden bg-background">
                    <aside className="hidden md:block">
                        <Sidebar />
                    </aside>
                    <main className="flex-1 overflow-y-auto px-8 py-4">{children}</main>
                </div>
            </body>
        </html>
    )
}
