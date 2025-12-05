import { notFound } from "next/navigation";
import { getProduct, updateProduct } from "@/app/actions/product";
import { ProductForm } from "@/components/product-form";

interface EditProductPageProps {
	params: {
		id: string;
	};
}

export default async function EditProductPage({
	params,
}: EditProductPageProps) {
	const product = await getProduct(params.id);

	if (!product) {
		notFound();
	}

	const updateProductWithId = updateProduct.bind(null, product.id);

	return (
		<ProductForm
			initialData={product}
			action={updateProductWithId}
			title="Edit Product"
			description="Update the product details."
			submitLabel="Save Changes"
		/>
	);
}
