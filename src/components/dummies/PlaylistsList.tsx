import SavedPlaylistCard from './SavedPlaylistCard'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/src/api/api'
import { usePlaylistStore } from '@/src/stores/playlist.store'
import { Playlist } from '@/src/types/film.types'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function PlaylistsList() {
	const setPlaylists = usePlaylistStore(state => state.setItems)

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ['playlists'],
		queryFn: async () =>
			await api.get<Playlist[]>('/playlists', {
				params: {
					is_viewed: false,
				},
			}),
	})

	useEffect(() => {
		if (isSuccess) {
			setPlaylists(data.data)
		}
	}, [data, isSuccess, setPlaylists])

	return (
		<>
			{isLoading ? (
				<Skeleton className='h-64 w-full' />
			) : (
				<div className='grid grid-cols-1 gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3'>
					{data?.data.map(item => (
						<SavedPlaylistCard
							films={item?.films}
							id={item.id}
							is_viewed={item.is_viewed}
							title={item.title}
							key={item.id}
						/>
					))}
				</div>
			)}
			{!data?.data.length && !isLoading && (
				<p className='my-10 text-center text-lg font-medium'>
					Нет сохраненных подборок
				</p>
			)}
		</>
	)
}
