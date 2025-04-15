'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { api } from '@/src/api/api'
import InvitationLinkDisplay from '@/src/components/ui/InvitationLinkDisplay'
import { useDebounce } from '@/src/hooks/use-debounce'
import { useVoteStore } from '@/src/stores/vote.store'
import { Film } from '@/src/types/film.types'
import { cn } from '@/src/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export interface VotingMovieData {
	id: number
	movie: Film
	author: string
	isCurrentUser: boolean
}
const formSchema = z.object({
	title: z.string().min(2, { message: 'Укажите название' }).max(50, {
		message: 'Максимум 50 символов',
	}),
})

export default function VotingPrepareSection({
	onSubmit,
	createMovie,
	deleteMovie,
	startVote,
}: {
	onSubmit: (movies: { title: string }[]) => void
	createMovie: (title: string) => void
	deleteMovie: (id: string, title: string) => void
	startVote: () => void
}) {
	const [movies, setMovies] = useState<{ title: string }[]>([])
	const [open, setOpen] = useState(false)

	const [once, setOnce] = useState(false)

	const { room, id } = useVoteStore()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	})

	function addMovie(movie: { title: string }) {
		toast.success('Фильм успешно добавлен!')
		createMovie(movie.title)
		setOnce(true)
		setMovies(prev => [...prev, movie])
		setOpen(false)
	}

	const path = usePathname()

	const [searchValue, setSearchValue] = useState('')

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

	function onSubmitHandler(data: z.infer<typeof formSchema>) {
		addMovie({
			title: data.title,
		})
	}

	const [ownerId, setOwnerId] = useState<string | null>()
	useEffect(() => {
		const storedValue = localStorage.getItem('ownerId')
		setOwnerId(storedValue)
	}, [])

	return (
		<div className='flex w-full flex-col justify-center'>
			<div className='mt-10 text-2xl font-bold'>
				Голосование. Этап подготовки.
			</div>
			<hr className='my-4' />
			<div className='flex flex-col justify-between md:flex-row lg:flex-row'>
				<InvitationLinkDisplay
					link={`http://prod-team-26-ehufonid.REDACTED/${path}`}
				/>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className='mt-2 w-[150px]' disabled={once}>
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
											<div>{movie.year}</div>
										</CardDescription>
									</Card>
								))}
							</div>
						</ScrollArea>

						<DialogFooter>
							{isMovieSelected && (
								<Button
									className='w-full'
									type='submit'
									//@ts-ignore
									onClick={() => addMovie(movie)}
								>
									Сохранить
								</Button>
							)}
							{!isMovieSelected && (
								<Dialog>
									<DialogTrigger asChild>
										<Button className='mt-10 w-full'>
											Добавить фильм самостоятельно
										</Button>
									</DialogTrigger>
									<DialogContent className='max-h-[90vh] overflow-y-auto'>
										<DialogHeader>
											<DialogTitle>Создать фильм</DialogTitle>
											<DialogDescription>
												Добавьте название для фильма
											</DialogDescription>
										</DialogHeader>
										<Form {...form}>
											<form
												onSubmit={form.handleSubmit(onSubmitHandler)}
												id='save-name'
												className='flex flex-col gap-4'
											>
												<FormField
													control={form.control}
													name='title'
													render={({ field }) => (
														<FormItem className='w-full'>
															<div className='mb-2 text-[14px]'>
																Название фильма
															</div>
															<FormControl>
																<Input
																	className='col-span-3 text-[14px]'
																	placeholder='Введите название фильма'
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</form>
											<DialogFooter>
												<Button
													form='save-name'
													type='submit'
													className='w-full'
												>
													Сохранить
												</Button>
											</DialogFooter>
										</Form>
									</DialogContent>
								</Dialog>
							)}
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			<hr className='my-4' />
			<div className='text-md mb-2 font-bold'>Добавленные фильмы</div>
			<div className='my-6 flex flex-col gap-4'>
				{room.films.length > 0 &&
					room.films.map(movie => (
						<Card key={movie.title}>
							<CardContent className='flex items-center justify-between'>
								<p className='text-lg font-semibold'>{movie.title}</p>
								{
									//@ts-ignore
									movie.user_id === (ownerId ?? id) && (
										<Button
											onClick={() => {
												setMovies(prev =>
													prev.filter(item => item.title !== movie.title)
												)
												deleteMovie(movie.id, movie.title)
												setOnce(false)
											}}
										>
											Удалить
										</Button>
									)
								}
							</CardContent>
						</Card>
					))}
			</div>
			{room.films.length === 0 && (
				<p className='my-4 text-center text-xl font-semibold'>Нет фильмов</p>
			)}
			{ownerId && (
				<div className='mt-10 flex justify-center'>
					<Button
						className='w-[200px]'
						disabled={!room.films.length}
						onClick={startVote}
					>
						Начать голосование
					</Button>
				</div>
			)}
		</div>
	)
}
