import axios from 'axios'
import Cookies from 'js-cookie'

export const api = axios.create({
	baseURL: 'http://prod-team-26-ehufonid.REDACTED/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

// https://github.com/blinovvvvvv/education-app/blob/main/src/shared/api/api.ts
api.interceptors.request.use(config => {
	const accessToken = Cookies.get('token')

	if (config.headers && accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})
