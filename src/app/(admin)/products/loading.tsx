import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
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
                            <TableHead className="w-20">
                                <Skeleton className="h-4 w-8" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-12" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                            <TableHead>
                                <Skeleton className="h-4 w-16" />
                            </TableHead>
                            <TableHead className="text-right">
                                <Skeleton className="h-4 w-12 ml-auto" />
                            </TableHead>
                            <TableHead className="text-right">
                                <Skeleton className="h-4 w-12 ml-auto" />
                            </TableHead>
                            <TableHead className="text-right">
                                <Skeleton className="h-4 w-16 ml-auto" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-32" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Skeleton className="h-4 w-12 ml-auto" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
