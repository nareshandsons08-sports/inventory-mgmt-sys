import { writeFile } from "node:fs/promises"
import { join } from "node:path"

export async function uploadImage(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`
    const path = join(process.cwd(), "public/uploads", filename)

    try {
        await writeFile(path, buffer)
        return `/uploads/${filename}`
    } catch (error) {
        console.error("Error uploading file:", error)
        return null
    }
}
