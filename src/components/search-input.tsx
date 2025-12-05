"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect, useState } from "react"

export function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [value, setValue] = useState(searchParams.get("q") ?? "")
    const debouncedValue = useDebounce(value, 500)

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedValue) {
            params.set("q", debouncedValue)
            params.set("page", "1") // Reset to page 1 on search
        } else {
            params.delete("q")
            params.delete("page") // Remove page param when search is cleared
        }

        // Avoid infinite loop: only push if query string actually changes
        if (params.toString() !== searchParams.toString()) {
            startTransition(() => {
                router.push(`?${params.toString()}`)
            })
        }
    }, [debouncedValue, router, searchParams])

    return (
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {isPending && (
                <div className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
        </div>
    )
}
