"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { checkLowStock } from "@/actions/notifications"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationBell() {
    const [alerts, setAlerts] = useState<{ id: string; name: string; stockQty: number; minStock: number }[]>([])

    useEffect(() => {
        const fetchAlerts = async () => {
            const data = await checkLowStock()
            setAlerts(data)
        }

        fetchAlerts()
        // Poll every 5 minutes
        const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                    <Bell className="h-5 w-5" />
                    {alerts.length > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {alerts.length === 0 ? (
                    <DropdownMenuItem disabled>No new notifications</DropdownMenuItem>
                ) : (
                    alerts.map((alert) => (
                        <DropdownMenuItem key={alert.id} asChild>
                            <Link href="/products" className="flex flex-col items-start gap-1 cursor-pointer">
                                <span className="font-medium text-destructive">Low Stock Alert</span>
                                <span className="text-xs text-muted-foreground">
                                    {alert.name} is low ({alert.stockQty} / {alert.minStock})
                                </span>
                            </Link>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
