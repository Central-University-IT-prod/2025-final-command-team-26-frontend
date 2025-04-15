'use client'

import { Button } from '@/components/ui/button'
import { Card, CardDescription } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/src/api/api'
import { queryClient } from '@/src/app/Providers'
import CreateMovieDialog from '@/src/components/dummies/CreateMovieDialog'
import { useDebounce } from '@/src/hooks/use-debounce'
import { Film } from '@/src/types/film.types'
import { cn } from '@/src/utils/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SaveDialog() {
	const [open, setOpen] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [note, setNote] = useState('')

	const [isMovieSelected, setIsMovieSelected] = useState(false)
	const [movie, setMovie] = useState<Film>()

	const debouncedValue = useDebounce(searchValue, 100)

	const { data, isSuccess } = useQuery({
		queryKey: ['search-movie', debouncedValue],
		queryFn: async () =>
			await api.get<Film[]>('/user/films/search/film', {
				params: {
					search: debouncedValue,
				},
			}),
		enabled: !!debouncedValue,
	})

	const { mutateAsync } = useMutation({
		mutationFn: async () => {
			const res = await api.get('/user/films/search/get_genres', {
				params: {
					//@ts-ignore
					genres: movie?.genre_ids.toString(),
				},
			})

			return await api.post('/user/films', {
				...movie,
				//@ts-ignore
				year: movie?.release_date.substring(0, 4),
				//@ts-ignore
				genres: res.data.map(i => i.id),
				note,
			})
		},

		onSuccess: () => {
			toast('Фильм сохранён')
			queryClient.invalidateQueries({
				queryKey: ['films'],
			})
			setOpen(false)
			setIsMovieSelected(false)
			setSearchValue('')
			setMovie(undefined)
		},
	})

	const onClick = () => {
		mutateAsync()
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='mx-auto w-[200px] px-6 py-4 text-lg'>
					Добавить фильм
				</Button>
			</DialogTrigger>
			<DialogContent className='top-[300px] sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Сохранить фильм</DialogTitle>
					<DialogDescription>
						Добавьте фильм, который Вы хотели бы не забыть посмотреть.
					</DialogDescription>
				</DialogHeader>
				<Input
					placeholder='Поиск фильма...'
					className='block px-3 text-lg'
					value={searchValue}
					onChange={e => {
						setIsMovieSelected(false)
						setSearchValue(e.target.value)
					}}
				/>

				<ScrollArea
					className={cn(
						'invisible h-0 w-full rounded-md border transition-all duration-500',
						{
							['visible h-[250px]']:
								//@ts-ignore
								data?.data?.length > 0 && isSuccess && !isMovieSelected,
						}
					)}
				>
					<div className='p-1'>
						{data?.data.map(movie => (
							<Card
								key={movie.id}
								onClick={() => {
									setSearchValue(movie.title)
									setMovie(movie)
									setIsMovieSelected(true)
								}}
								className='rounded-md border-0 border-none px-2 py-4 shadow-none hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'
							>
								<CardDescription className='flex flex-row justify-between gap-2 p-0'>
									<div className='text-black dark:text-white'>
										{movie.title}
									</div>

									<div className='text-black dark:text-white'>{movie.year}</div>
								</CardDescription>
							</Card>
						))}
					</div>
				</ScrollArea>

				{isMovieSelected && (
					<div className='w-full'>
						<div className='mb-2 text-[14px]'>Заметка</div>
						<Textarea
							value={note}
							onChange={e => setNote(e.target.value)}
							placeholder='Запишите что-то если надо по этому фильму'
						/>
					</div>
				)}
				<DialogFooter>
					{isMovieSelected && (
						<Button className='w-full' type='submit' onClick={onClick}>
							Сохранить
						</Button>
					)}
					{!isMovieSelected && <CreateMovieDialog setExternalOpen={setOpen} />}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
