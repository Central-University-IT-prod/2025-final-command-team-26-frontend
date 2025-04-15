import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	poweredByHeader: false,
	reactStrictMode: true,
	cleanDistDir: true,
	output: 'standalone',
}

export default nextConfig
