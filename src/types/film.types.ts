import { Genre } from './genre.types'

export interface Film {
	id: string
	title: string
	year: number
	is_viewed: boolean
	genres: Genre[]
	link: string
	note: string
}

export interface Playlist {
	id: string
	title: string
	is_viewed: boolean
	films: Film[]
}
