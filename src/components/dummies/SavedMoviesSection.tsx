'use client'

import SavedMovieCard from './SavedMovieCard'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/src/api/api'
import { queryClient } from '@/src/app/Providers'
import FiltersSheet from '@/src/components/dummies/FiltersSheet'
import { useFilmStore } from '@/src/stores/film.store'
import { Film } from '@/src/types/film.types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function SavedMoviesSection() {
	const setFilms = useFilmStore(state => state.setItems)

	const films = useFilmStore(state => state.items)

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['films'],
		queryFn: async () =>
			await api.get<Film[]>('/user/films', {
				params: {
					is_viewed: false,
				},
			}),
	})

	const { mutateAsync } = useMutation({
		mutationFn: async (id: string) =>
			await api.post(`/user/films/${id}/view`, {
				is_viewed: true,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries()
			toast('Фильм просмотрен')
		},
	})

	useEffect(() => {
		if (isSuccess) {
			setFilms(data.data)
		}
	}, [data, isSuccess, setFilms])

	return (
		<div className='m-auto w-full'>
			<div className='my-5 flex w-full items-center justify-between rounded-md bg-white p-4 shadow-md dark:bg-[#333]'>
				<div className='text-[20px] font-bold'>Мои сохранённые фильмы</div>
				<FiltersSheet />
			</div>

			{isLoading ? (
				<Skeleton className='h-64 w-full' />
			) : (
				<div className='grid grid-cols-1 gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3'>
					{films?.map(item => (
						<SavedMovieCard
							btnText='Пометить просмотренным'
							onClick={mutateAsync}
							movie={item}
							key={item.id}
						/>
					))}
				</div>
			)}
			{!films.length && !isLoading && (
				<p className='my-10 text-center text-lg font-medium'>
					Нет сохраненных фильмов
				</p>
			)}
		</div>
	)
}
