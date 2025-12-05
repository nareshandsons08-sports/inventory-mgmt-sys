import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/Sidebar"
import { MobileNav } from "@/components/mobile-nav"

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
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <MobileNav />
                        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
                    </div>
                </div>
            </body>
        </html>
    )
}
