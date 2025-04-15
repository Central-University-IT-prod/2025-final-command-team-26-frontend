'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/src/api/api'
import { Film } from '@/src/types/film.types'
import { useQuery } from '@tanstack/react-query'

export default function Recommendations() {
	const { data, refetch } = useQuery({
		queryKey: ['recommendations'],
		queryFn: async () =>
			await api.get<Film[]>('/user/films', {
				params: {
					recommendate: true,
					is_viewed: false,
				},
			}),
		refetchOnMount: 'always',
	})

	return (
		<Dialog
			onOpenChange={open => {
				if (!open) refetch()
			}}
		>
			<DialogTrigger asChild>
				<Button>Удиви меня</Button>
			</DialogTrigger>
			<DialogContent className=''>
				<DialogHeader>
					<DialogTitle>Рекомендации</DialogTitle>
					<DialogDescription>
						Вот список рекомендованных фильмов для Вас.
					</DialogDescription>
				</DialogHeader>

				<div className='my-5 flex flex-col gap-4'>
					{data?.data.map(item => (
						<Card key={item.id}>
							<CardContent className='flex flex-col gap-2'>
								<p className='text-lg font-medium'>{item.title}</p>
								{item.year && <p>{item.year} г.</p>}
								<div className='flex flex-wrap gap-1'>
									{item.genres.map(genre => (
										<Badge key={genre.id}>{genre.title}</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button className='w-full'>Закрыть</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
