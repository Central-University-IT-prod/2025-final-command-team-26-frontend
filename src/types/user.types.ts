export interface UserFilm {
	id: string
	user_id: string
	note?: string
	link?: string
	is_viewed?: boolean
	view_date?: string
	film_id: string
}

export interface User {
	id: string
	token: string
	login: string
}
