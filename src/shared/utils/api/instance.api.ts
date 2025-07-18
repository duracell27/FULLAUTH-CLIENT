import { FetchClient } from '../fetch/fetchClient'

export const api = new FetchClient({
	baseUrl:
		// process.env.SERVER_URL as string,

		process.env.DEV_MODE === 'DEV'
			? (process.env.SERVER_URL as string)
			: (process.env.SERVER_PATH as string),
	options: {
		credentials: 'include'
	}
})
