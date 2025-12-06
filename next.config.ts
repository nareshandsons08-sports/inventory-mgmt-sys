import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    experimental: {
        useCache: true,
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
}

export default nextConfig
