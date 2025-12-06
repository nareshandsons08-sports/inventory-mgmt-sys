"use client"

import { useState } from "react"
import { createAdjustment } from "@/actions/adjustment"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function StockAdjustmentDialog({
    productId,
    productName,
    currentStock,
}: {
    productId: string
    productName: string
    currentStock: number
}) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                    Adjust Stock
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form
                    action={async (formData) => {
                        await createAdjustment(formData)
                        setOpen(false)
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>Adjust Stock</DialogTitle>
                        <DialogDescription>
                            Make manual corrections to stock levels for {productName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <input type="hidden" name="productId" value={productId} />
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Current</Label>
                            <div className="col-span-3 font-mono">{currentStock}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="qtyChange" className="text-right">
                                Change
                            </Label>
                            <Input
                                id="qtyChange"
                                name="qtyChange"
                                type="number"
                                placeholder="-1 or 5"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right">
                                Reason
                            </Label>
                            <Input
                                id="reason"
                                name="reason"
                                placeholder="Damaged, Found, Audit..."
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="cursor-pointer">
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
