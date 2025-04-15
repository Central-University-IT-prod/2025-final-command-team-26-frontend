import { Film } from '../types/film.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Room {
	id: string
	state: number
	title: string
	films: Film[]
	rounds: [
		{
			state: number
			votes: {
				user_id: string
				film_id: string
			}
		},
	]
}

type VoteStoreState = {
	id: string
	login: string
	room: Room
}

type VoteStoreActions = {
	setId: (id: string) => void
	setLogin: (login: string) => void
	setRoom: (room: Room) => void
}

export type VoteStore = VoteStoreState & VoteStoreActions

export const useVoteStore = create<VoteStore>()(
	persist(
		set => ({
			id: '',
			login: '',
			room: {
				id: '',
				films: [],
				rounds: [
					{
						state: 0,
						votes: {
							film_id: '',
							user_id: '',
						},
					},
				],
				state: 0,
				title: '',
			},
			setRoom: room => set({ room }),

			setId: id => set({ id }),
			setLogin: login => set({ login }),
		}),
		{
			name: 'vote-store',
		}
	)
)
