# File Upload Strategy for Production

## Current Implementation (Local)

Currently, images are uploaded to the `public/uploads` directory on the local filesystem. This works perfectly for development (`localhost`) and traditional VPS hosting (like DigitalOcean Droplets or generic EC2 instances) where the filesystem is persistent.

## The Problem with Vercel (Serverless)

Vercel is a serverless platform. The filesystem in a serverless function is **ephemeral**.

-   When you upload a file to `public/uploads` in a running Vercel function, it is written to a temporary disk.
-   **As soon as the function execution finishes or the container recycles (which happens frequently), that file is deleted.**
-   This means users will upload images, see them for a brief moment, and then they will disappear (404 Error).

## Recommended Solution: Object Storage

For Vercel (and scalable production apps in general), you should store files in an external Object Storage service.

### Options

1.  **Vercel Blob** (Recommended for Vercel)
    -   **Pros**: Zero config, built into Vercel SDK, super fast.
    -   **Cons**: Paid limits (but generous free tier).
2.  **AWS S3**
    -   **Pros**: Industry standard, cheapest at scale.
    -   **Cons**: More complex setup (IAM users, buckets, permissions).
3.  **Cloudinary** / **UploadThing**
    -   **Pros**: Image optimization built-in, easy transformations.

## Migration Plan

When you are ready to deploy:

1.  **Install SDK**: `pnpm add @vercel/blob` (or aws-sdk).
2.  **Update `upload.ts`**: Replace the `writeFile` logic with `put` from the SDK.

    ```typescript
    import { put } from "@vercel/blob"

    export async function uploadImage(file: File) {
        const blob = await put(file.name, file, { access: "public" })
        return blob.url
    }
    ```

3.  **Update Database**: No change needed! The `imageUrl` field will just store the full URL (e.g., `https://.../image.jpg`) instead of a relative path.
