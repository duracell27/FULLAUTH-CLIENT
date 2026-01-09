import type { NextConfig } from 'next'

const nextConfig: NextConfig = {

	env: {
		SERVER_URL: process.env.SERVER_URL,
		SERVER_PATH: process.env.SERVER_PATH,
		DEV_MODE: process.env.DEV_MODE,
		GOOGLE_RECAPTCHA_SITE_KEY: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
		FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
		CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
		CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
		GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS
	},
	async rewrites() {

		return [
			{
				source: `${process.env.SERVER_PATH}/:path*`,
				destination: `${process.env.SERVER_URL}/:path*`
			}
		]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com'
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com'
			}
		]
	}
}
export default nextConfig
