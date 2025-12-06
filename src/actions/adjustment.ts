"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const adjustmentSchema = z.object({
	productId: z.string(),
	qtyChange: z.coerce.number().int(),
	reason: z.string().min(1, "Reason is required"),
});

export async function createAdjustment(formData: FormData) {
	const rawData = {
		productId: formData.get("productId"),
		qtyChange: formData.get("qtyChange"),
		reason: formData.get("reason"),
	};

	const validatedData = adjustmentSchema.safeParse(rawData);

	if (!validatedData.success) {
		return { error: "Invalid data" };
	}

	const { productId, qtyChange, reason } = validatedData.data;

	// TODO: Get actual user ID
	const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
	const userId = adminUser?.id || "placeholder-user-id";

	try {
		await prisma.$transaction(async (tx) => {
			// 1. Create Adjustment Record
			await tx.adjustment.create({
				data: {
					productId,
					qtyChange,
					reason,
					userId,
				},
			});

			// 2. Update Product Stock
			await tx.product.update({
				where: { id: productId },
				data: {
					stockQty: {
						increment: qtyChange,
					},
				},
			});
		});
	} catch (error) {
		console.error("Adjustment failed:", error);
		return { error: "Adjustment failed" };
	}

	revalidatePath("/products");
	redirect("/products");
}
