import { Genre } from '../types/genre.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type GenreStoreState = {
	items: Genre[]
}

type GenreStoreActions = {
	addGenre: (item: Genre) => void
	removeGenre: (item: Genre) => void
	setItems: (items: Genre[]) => void
}

export type GenreStore = GenreStoreState & GenreStoreActions

export const useGenreStore = create<GenreStore>()(
	persist(
		set => ({
			items: [],
			addGenre: genre =>
				set(state => ({
					items: [...state.items, genre],
				})),
			removeGenre: Genre =>
				set(state => ({
					items: state.items.filter(item => item.id === Genre.id),
				})),
			setItems: items => set({ items }),
		}),
		{
			name: 'Genre-store',
		}
	)
)
