import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
    const columns = [
        { className: "w-20", header: "w-8", cell: <Skeleton className="h-10 w-10 rounded-full" /> },
        { header: "w-12", cell: <Skeleton className="h-4 w-16" /> },
        { header: "w-24", cell: <Skeleton className="h-4 w-32" /> },
        { header: "w-16", cell: <Skeleton className="h-4 w-20" /> },
        { header: "w-16", cell: <Skeleton className="h-4 w-20" /> },
        { className: "text-right", header: "w-12 ml-auto", cell: <Skeleton className="h-4 w-16 ml-auto" /> },
        { className: "text-right", header: "w-12 ml-auto", cell: <Skeleton className="h-4 w-12 ml-auto" /> },
        {
            className: "text-right",
            header: "w-16 ml-auto",
            cell: (
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            ),
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-9 w-32" /> {/* Title */}
                <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row">
                    <Skeleton className="h-10 w-full sm:w-[120px]" /> {/* Import Button */}
                    <Skeleton className="h-10 w-full sm:w-[140px]" /> {/* Add Button */}
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Skeleton className="h-10 w-full sm:w-[300px]" /> {/* Search */}
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" /> {/* Filter 1 */}
                    <Skeleton className="h-10 w-24" /> {/* Filter 2 */}
                </div>
            </div>

            <div className="rounded-md border bg-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, i) => (
                                <TableHead key={i} className={col.className}>
                                    <Skeleton className={`h-4 ${col.header}`} />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                {columns.map((col, j) => (
                                    <TableCell key={j} className={col.className}>
                                        {col.cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
