'use client'

import PlaylistFormModal from '../dummies/PlaylistFormModal'
import PlaylistsList from '../dummies/PlaylistsList'
import Recommendations from '../dummies/Recommendations'
import SaveDialog from '../dummies/SaveDialog'
import SavedMoviesSection from '../dummies/SavedMoviesSection'
import StartVote from '../dummies/StartVote'
import WatchedList from '../dummies/WatchedList'
import Header from '../layouts/header'
import Container from '../ui/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/src/api/api'
import { useGenreStore } from '@/src/stores/genre.store'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export function HomePage() {
	const { data, isSuccess } = useQuery({
		queryKey: ['genres'],
		queryFn: async () => await api.get('/genres'),
	})

	const setGenres = useGenreStore(state => state.setItems)

	useEffect(() => {
		if (data && isSuccess) {
			setGenres(data.data)
		}
	}, [data, isSuccess, setGenres])

	return (
		<>
			<Header />
			<Container className='mt-5'>
				<main>
					<div className='flex h-170 justify-center md:h-130 md:items-center lg:h-130 lg:items-center'>
						<div className='h-auto w-auto space-y-4 md:w-[600px] lg:w-[600px]'>
							<div className='flex h-70 flex-col justify-center space-y-5 rounded-xl bg-white px-5 shadow-md md:py-7 lg:py-7 dark:bg-[#333]'>
								<div className='flex w-full flex-col space-y-6'>
									<div className='text-center text-2xl font-bold md:mx-14 md:text-3xl lg:mx-14 lg:text-3xl'>
										Добавьте фильм, который хотели бы посмотреть потом
									</div>
									<SaveDialog />
								</div>
							</div>
							<div className='flex flex-col justify-between space-y-4 space-x-4 md:h-45 md:flex-row md:space-y-0 lg:h-45 lg:flex-row'>
								<div className='flex w-full items-center rounded-xl bg-white py-4 shadow-md md:w-1/2 md:py-0 lg:w-1/2 lg:py-0 dark:bg-[#333]'>
									<div className='space-y-4 px-4 text-center'>
										<div className='font-bold'>Рекомендация фильмов</div>
										<div className=''>
											Порекомендуем Вам фильмы из тех, что Вы добавили
										</div>
										<Recommendations />
									</div>
								</div>
								<div className='flex w-full items-center justify-center rounded-xl bg-white py-4 shadow-md md:w-1/2 md:py-0 lg:w-1/2 lg:py-0 dark:bg-[#333]'>
									<div className='space-y-4 px-4 text-center'>
										<div className='font-bold'>Голосование</div>
										<div className=''>Выберите фильм вместе с друзьями!</div>
										<StartVote />
									</div>
								</div>
							</div>
						</div>
					</div>
					<Tabs defaultValue='films' className='mt-4'>
						<TabsList className='mx-auto mb-4'>
							<TabsTrigger className='px-2 py-3 md:px-5' value='films'>
								Мои фильмы
							</TabsTrigger>
							<TabsTrigger className='px-2 py-3 md:px-5' value='playlists'>
								Подборки
							</TabsTrigger>
							<TabsTrigger className='px-2 py-3 md:px-5' value='watched'>
								Просмотренные
							</TabsTrigger>
						</TabsList>
						<TabsContent className='min-h-100' value='films'>
							<SavedMoviesSection />
						</TabsContent>
						<TabsContent className='min-h-100' value='watched'>
							<div className='my-5 flex w-full items-center justify-between rounded-md bg-white p-4 shadow-md dark:bg-[#333]'>
								<div className='text-[20px] font-bold'>
									Мои просмотренные фильмы
								</div>
							</div>
							<WatchedList />
						</TabsContent>
						<TabsContent className='min-h-100' value='playlists'>
							<div className='my-5 flex w-full items-center justify-between rounded-md bg-white p-4 shadow-md dark:bg-[#333]'>
								<div className='text-[20px] font-bold'>Мои подборки</div>
								<PlaylistFormModal />
							</div>
							<PlaylistsList />
						</TabsContent>
					</Tabs>
				</main>
			</Container>
		</>
	)
}
