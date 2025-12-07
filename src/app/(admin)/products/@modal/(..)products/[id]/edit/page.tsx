import { notFound } from "next/navigation"
import { getProduct, updateProduct } from "@/actions/product"
import { InterceptedDialog } from "@/components/intercepted-dialog"
import { ProductForm } from "@/components/product-form"

export default async function InterceptedEditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    const updateProductWithId = updateProduct.bind(null, product.id)

    return (
        <InterceptedDialog title="Edit Product">
            <ProductForm
                initialData={product}
                action={updateProductWithId}
                title="Edit Product"
                description="Update the product details."
                submitLabel="Save Changes"
            />
        </InterceptedDialog>
    )
}
