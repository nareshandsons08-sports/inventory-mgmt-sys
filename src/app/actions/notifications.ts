"use server";

import { prisma } from "@/lib/prisma";

import { serializePrisma } from "@/lib/prisma-utils";

export async function checkLowStock(): Promise<
	{ id: string; name: string; stockQty: number; minStock: number }[]
> {
	const lowStockProducts = await prisma.product.findMany({
		where: {
			stockQty: {
				lte: prisma.product.fields.minStock,
			},
			isArchived: false,
		},
		select: {
			id: true,
			name: true,
			stockQty: true,
			minStock: true,
		},
	});
	return serializePrisma(lowStockProducts);
}
