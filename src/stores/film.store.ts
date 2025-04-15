import { Film } from '../types/film.types'
import { create } from 'zustand'

type FilmStoreState = {
	items: Film[]
}

type FilmStoreActions = {
	addFilm: (item: Film) => void
	removeFilm: (item: Film) => void
	setItems: (items: Film[]) => void
}

export type FilmStore = FilmStoreState & FilmStoreActions

export const useFilmStore = create<FilmStore>(set => ({
	items: [],
	addFilm: film =>
		set(state => ({
			items: [...state.items, film],
		})),
	removeFilm: film =>
		set(state => ({
			items: state.items.filter(item => item.id === film.id),
		})),
	setItems: items => set({ items }),
}))
