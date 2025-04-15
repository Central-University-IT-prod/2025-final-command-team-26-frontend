import SavedMovieCard from './SavedMovieCard'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/src/api/api'
import { queryClient } from '@/src/app/Providers'
import { Film } from '@/src/types/film.types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function WatchedList() {
	const { data, isLoading } = useQuery({
		queryKey: ['films-watched'],
		queryFn: async () =>
			await api.get<Film[]>('/user/films', {
				params: {
					is_viewed: true,
				},
			}),
	})

	const { mutateAsync } = useMutation({
		mutationFn: async (id: string) =>
			await api.post(`/user/films/${id}/view`, {
				is_viewed: false,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries()
			toast('Фильм удален из просмотренных')
		},
	})

	return (
		<>
			{isLoading ? (
				<Skeleton className='h-64 w-full' />
			) : (
				<div className='grid grid-cols-1 gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3'>
					{data?.data.map(item => (
						<SavedMovieCard
							btnText='Удалить из просмотренных'
							onClick={mutateAsync}
							movie={item}
							key={item.id}
						/>
					))}
				</div>
			)}

			{!data?.data.length && !isLoading && (
				<p className='my-10 text-center text-lg font-medium'>
					Нет просмотренных фильмов
				</p>
			)}
		</>
	)
}
