import { api } from '../api/api'
import { Film } from '../types/film.types'
import { Genre } from '../types/genre.types'
import { useFilmStore } from './film.store'
import qs from 'qs'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FilterStoreState = {
	name: string
	genres: Genre[]
	startYear: number | null
	endYear: number | null
}

type FilterStoreActions = {
	setName: (name: string) => void
	addGenre: (genre: Genre) => void
	setGenres: (genres: Genre[]) => void
	removeGenre: (genre: Genre) => void
	setStartYear: (startYear: number) => void
	setEndYear: (endYear: number) => void
	applyFilters: () => void
	clear: () => void
}

export type FilterStore = FilterStoreState & FilterStoreActions

export const useFilterStore = create<FilterStore>()(
	persist(
		(set, get) => ({
			name: '',
			genres: [],
			startYear: null,
			endYear: null,

			setName: name => set({ name }),
			addGenre: genre =>
				set(state => ({
					genres: [...state.genres, genre],
				})),
			removeGenre: genre =>
				set(state => ({
					genres: state.genres.filter(g => g.id !== genre.id),
				})),
			setGenres: genres => set({ genres }),
			setStartYear: startYear => set({ startYear }),
			setEndYear: endYear => set({ endYear }),
			clear: async () => {
				const data = await api.get<Film[]>('/user/films')

				useFilmStore.getState().setItems(data.data)

				set({
					name: '',
					genres: [],
					startYear: null,
					endYear: null,
				})
			},
			applyFilters: async () => {
				const { genres, startYear, endYear, name } = get()

				const data = await api.get<Film[]>('/user/films', {
					params: {
						...(genres && { genres: genres.map(g => g.id) }),
						...(startYear && { years_from: startYear }),
						...(endYear && { years_to: endYear }),
						...(name && { name }),
					},
					paramsSerializer: params => {
						return qs.stringify(params, { arrayFormat: 'repeat' })
					},
				})

				useFilmStore.getState().setItems(data.data)
			},
		}),
		{
			name: 'filter-store',
		}
	)
)
