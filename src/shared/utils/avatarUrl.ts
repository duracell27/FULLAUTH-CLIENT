const CLOUDINARY_TRANSFORM = 'w_100,h_100,c_fill,f_webp,q_80'

export const getAvatarUrl = (url: string | null | undefined): string => {
	if (!url || !url.length) return ''
	return url.replace('/upload/', `/upload/${CLOUDINARY_TRANSFORM}/`)
}
