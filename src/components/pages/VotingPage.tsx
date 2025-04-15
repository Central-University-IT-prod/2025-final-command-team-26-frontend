'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { api } from '@/src/api/api'
import VotingPrepareSection from '@/src/components/dummies/VotingPrepareSection'
import ActiveVotingSection from '@/src/components/widgets/ActiveVotingSection'
import VotingStatisticSection from '@/src/components/widgets/VotingStatisticSection'
import { useVoteStore } from '@/src/stores/vote.store'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const VotingPrepareSectionNoSSR = dynamic(
	() => Promise.resolve(VotingPrepareSection),
	{
		ssr: false,
	}
)

enum VotingStatus {
	NOT_STARTED,
	ACTIVE,
	STATISTIC,
	FINISHED,
}

interface VotingData {
	roundNumber: number
	votingStatus: VotingStatus
	movies: { title: string }[]
}

interface WebsocketReq {
	user_id: number
	action:
		| 'login'
		| 'get_room'
		| 'get_room'
		| 'remove_user'
		| 'add_film'
		| 'remove_film'
		| 'update_film'
		| 'start_vote'
		| 'vote'
	payload: {}
}

type TypeEvent = 'room' | 'user' | 'round_results'

export default function VotingPage({ id }: { id: string }) {
	const token = Cookies.get('token')
	const [ownerId, setOwnerId] = useState<string | null>()

	const {
		setId,
		setLogin: setLoginStore,
		login: storeLogin,
		id: storeId,
		setRoom,
		room,
	} = useVoteStore()

	useEffect(() => {
		const storedValue = localStorage.getItem('ownerId')
		setOwnerId(storedValue)
	}, [])

	const [open, setOpen] = useState(false)
	const [name, setName] = useState('')

	const [ended, setEnded] = useState(false)
	const [choice, setChoice] = useState({})

	const [login, setLogin] = useState('')

	const { data } = useQuery({
		queryKey: ['login'],
		queryFn: async () => await api.get<string>('/users/me'),
		enabled: !!token,
	})

	useEffect(() => {
		if (data?.data) setLogin(data?.data)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!token && !storeLogin) setOpen(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [votingData, setVotingData] = useState<VotingData>({
		roundNumber: 1,
		votingStatus: VotingStatus.NOT_STARTED,
		movies: [],
	})

	const [ws, setWs] = useState<WebSocket | null>(null)

	useEffect(() => {
		const websocket = new WebSocket(
			`ws://prod-team-26-ehufonid.REDACTED/api/rooms/ws/${id}`
		)

		websocket.onmessage = event => {
			const data = JSON.parse(event.data)

			if (data.type === 'user' && data) {
				setId(data.payload.id)
				setLoginStore(data.payload.login)
				setOpen(false)
			}
			if (data.type === 'room' && data.payload) {
				setRoom(data.payload)
			}
			if (data.type === 'round_results' && data?.payload?.choice?.title) {
				setEnded(true)
				setChoice(data.payload.choice)
			}
		}

		setWs(websocket)

		return () => {
			websocket.close()
			setRoom({
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
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function getTestVotesResult(): {
		title: string
		votes: number
	}[] {
		//@ts-ignore
		return votingData.movies.map((movie, index) => {
			return {
				title: movie,
				votes: index + 1,
			}
		})
	}

	const joinRoom = () => {
		if (ws && name) {
			ws.send(
				JSON.stringify({
					action: 'login',
					payload: {
						login: name,
					},
				})
			)
		}
	}

	const addMovie = (title: string) => {
		if (ws) {
			ws.send(
				JSON.stringify({
					action: 'add_film',
					user_id: ownerId ?? storeId,
					payload: {
						user_id: ownerId ?? storeId,
						title,
					},
				})
			)
		}
	}

	const deleteMovie = (id: string, title: string) => {
		if (ws) {
			ws.send(
				JSON.stringify({
					action: 'remove_film',
					user_id: ownerId ?? storeId,
					payload: {
						id,
						user_id: ownerId ?? storeId,
						title,
					},
				})
			)
		}
	}

	const startVote = () => {
		if (ws) {
			ws.send(
				JSON.stringify({
					action: 'start_vote',
					user_id: ownerId,
				})
			)
		}
	}

	const doVote = (filmId: string) => {
		if (ws) {
			ws.send(
				JSON.stringify({
					action: 'vote',
					payload: {
						user_id: ownerId ?? storeId,
						film_id: filmId,
					},
				})
			)
		}
	}

	return (
		<>
			<Dialog open={open}>
				<DialogContent className='top-[300px] sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Присоединиться к голосованию</DialogTitle>
						<DialogDescription>
							Укажите имя, чтобы присоединиться к голосованию
						</DialogDescription>
					</DialogHeader>
					<Input
						placeholder='Имя...'
						className='block px-3 text-lg'
						value={name}
						onChange={e => {
							setName(e.target.value)
						}}
					/>

					<DialogFooter>
						<Button
							disabled={!name.length}
							className='w-full'
							onClick={joinRoom}
						>
							Продолжить
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{room.state === 0 && (
				<VotingPrepareSectionNoSSR
					onSubmit={movies => {
						setVotingData(prevState => ({
							...prevState,
							movies,
							votingStatus: VotingStatus.ACTIVE,
						}))
					}}
					createMovie={addMovie}
					deleteMovie={deleteMovie}
					startVote={startVote}
				/>
			)}
			{room.state === 1 && !ended && (
				<ActiveVotingSection
					timerTime={30}
					roundNumber={votingData.roundNumber}
					movies={room.films}
					onVote={doVote}
				/>
			)}
			{room.state === 2 && (
				<VotingStatisticSection
					timerTime={5}
					//@ts-ignore
					statistic={getTestVotesResult()}
					roundNumber={votingData.roundNumber}
					onEnd={() => {
						// nextStage(VotingStatus.ACTIVE)
					}}
				/>
			)}
			{ended && (
				<div className='mt-16 flex flex-col justify-center gap-10'>
					<p className='text-center text-xl'>Победитель</p>
					{/** @ts-ignore */}
					<p className='text-center text-2xl font-semibold'>{choice?.title}</p>
					<Link href={'/'} className='self-center'>
						<Button>На главную</Button>
					</Link>
				</div>
			)}
			{/*	<VotingNameRequestModal onSubmit={() => {}} isOpen={true} />*/}
		</>
	)
}
