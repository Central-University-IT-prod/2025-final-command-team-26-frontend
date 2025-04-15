import { api } from '../api/api'
import { Film, Playlist } from '../types/film.types'
import { Genre } from '../types/genre.types'
import { useFilmStore } from './film.store'
import qs from 'qs'
import { create } from 'zustand'

type PlaylistStoreState = {
	items: Playlist[]
	name: string
	genres: Genre[]
	startYear: number | null
	endYear: number | null
	movies: Film[]
}

type PlaylistStoreActions = {
	setMovies: (movies: Film[]) => void
	addPlaylist: (item: Playlist) => void
	removePlaylist: (item: Playlist) => void
	setItems: (items: Playlist[]) => void
	setName: (name: string) => void
	addGenre: (genre: Genre) => void
	setGenres: (genres: Genre[]) => void
	removeGenre: (genre: Genre) => void
	setStartYear: (startYear: number) => void
	setEndYear: (endYear: number) => void
	applyFilters: (id: string) => void
	clear: () => void
}

export type PlaylistStore = PlaylistStoreState & PlaylistStoreActions

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
	items: [],
	movies: [],
	setMovies: movies => set({ movies }),
	addPlaylist: Playlist =>
		set(state => ({
			items: [...state.items, Playlist],
		})),
	removePlaylist: Playlist =>
		set(state => ({
			items: state.items.filter(item => item.id === Playlist.id),
		})),
	setItems: items => set({ items }),

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
	applyFilters: async (id: string) => {
		const { genres, startYear, endYear, name, setMovies } = get()

		const data = await api.get<Film[]>('/user/films', {
			params: {
				...(genres && { genres: genres.map(g => g.id) }),
				...(startYear && { years_from: startYear }),
				...(endYear && { years_to: endYear }),
				...(name && { name }),
				playlist: id,
			},
			paramsSerializer: params => {
				return qs.stringify(params, { arrayFormat: 'repeat' })
			},
		})

		setMovies(data.data)
	},
}))
