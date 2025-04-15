'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { api } from '@/src/api/api'
import { queryClient } from '@/src/app/Providers'
import { useFilmStore } from '@/src/stores/film.store'
import { useGenreStore } from '@/src/stores/genre.store'
import { usePlaylistStore } from '@/src/stores/playlist.store'
import { Playlist } from '@/src/types/film.types'
import { cn } from '@/src/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Укажите название',
	}),
})

const startYears: string[] = []

for (let i = 2025; i >= 1900; i--) {
	startYears.push(String(i))
}

export default function SavedPlaylistCard(item: Playlist) {
	const [open, setOpen] = useState(false)
	const [editOpen, setEditOpen] = useState(false)

	// const [movies, setMovies] = useState<Film[]>([])

	const movies = usePlaylistStore(state => state.movies)
	const setMovies = usePlaylistStore(state => state.setMovies)

	const films = useFilmStore(state => state.items).filter(f => !f.is_viewed)

	const [searchValue, setSearchValue] = useState('')
	const [filterSearchValue, setFilterSearchValue] = useState('')

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: item.title,
		},
	})

	useEffect(() => {
		setMovies(item.films)
	}, [item.films, setMovies])

	const { mutateAsync } = useMutation({
		mutationFn: async (title: string) =>
			await api.patch(`/playlists/${item.id}`, {
				title,
				// films: movies.map(m => m.id),
			}),
		onSuccess: () => {
			toast('Подборка сохранена')
			queryClient.invalidateQueries({
				queryKey: ['playlists'],
			})
			setEditOpen(false)
		},
	})

	const { mutateAsync: deletePlaylist } = useMutation({
		mutationFn: async () => await api.delete(`/playlists/${item.id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['playlists'],
			})
			toast('Подборка удалена')
		},
	})

	const { mutateAsync: watchMovie } = useMutation({
		mutationFn: async (id: string) =>
			await api.post(`/user/films/${id}/view`, {
				is_viewed: true,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['playlists'],
			})
			toast('Фильм просмотрен')
		},
	})

	const { mutateAsync: deleteWatch } = useMutation({
		mutationFn: async (id: string) =>
			await api.post(`/user/films/${id}/view`, {
				is_viewed: false,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['playlists'],
			})
		},
	})

	const { mutateAsync: deleteMovieFromPlaylist } = useMutation({
		mutationFn: async ({ id, filmId }: { id: string; filmId: string }) =>
			await api.delete(`/playlists/${id}/films/${filmId}`),
		onSuccess: () => {
			queryClient.invalidateQueries()
		},
	})

	const { mutateAsync: addMovie } = useMutation({
		mutationFn: async (filmId: string) =>
			await api.post(`/playlists/${item.id}/films`, {
				film_id: filmId,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries()
			setSearchValue('')
		},
	})

	const onAddMovie = (filmId: string) => {
		addMovie(filmId)
	}

	const onDeleteMovie = (id: string, filmId: string) => {
		deleteMovieFromPlaylist({
			id,
			filmId,
		})
	}

	const onDelete = () => {
		deletePlaylist()
	}

	const onWatch = (id: string) => {
		watchMovie(id)
	}

	const onDeleteWatch = (id: string) => {
		deleteWatch(id)
	}

	function onSubmit(data: z.infer<typeof formSchema>) {
		mutateAsync(data.name)
	}

	const [endDigits, setEndDigits] = useState(startYears)

	const genres = useGenreStore(state => state.items)

	const setStartYear = usePlaylistStore(state => state.setStartYear)

	const onChangeStartYear = (value: string) => {
		setStartYear(+value)
		setEndDigits(startYears.filter(end => end >= value))
	}

	const setEndYear = usePlaylistStore(state => state.setEndYear)

	const endYear = usePlaylistStore(state => state.endYear)
	const startYear = usePlaylistStore(state => state.startYear)

	const clearFilters = usePlaylistStore(state => state.clear)

	const name = usePlaylistStore(state => state.name)
	const setName = usePlaylistStore(state => state.setName)

	const genresState = usePlaylistStore(state => state.genres)
	const addGenre = usePlaylistStore(state => state.addGenre)
	const removeGenre = usePlaylistStore(state => state.removeGenre)

	const applyFilters = usePlaylistStore(state => state.applyFilters)

	useEffect(() => {
		setEndDigits(startYears.filter(end => +end >= startYear!))
	}, [startYear])

	return (
		<Card className='flex flex-col justify-between gap-2 bg-[#f0efef] dark:bg-[#1f1f1f]'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div>
					<CardDescription className='text-black dark:text-white'>
						Подборка
					</CardDescription>
					<CardTitle className='text-[20px] dark:text-white'>
						{item.title}
					</CardTitle>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='size-10'>
							<Menu />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={onDelete}>Удалить</DropdownMenuItem>
						<Dialog open={editOpen} onOpenChange={setEditOpen}>
							<DialogTrigger asChild>
								<DropdownMenuItem onSelect={e => e.preventDefault()}>
									Изменить
								</DropdownMenuItem>
							</DialogTrigger>
							<DialogContent className='max-h-[90vh] overflow-y-auto'>
								<DialogHeader>
									<DialogTitle>Изменить подборку</DialogTitle>
									<DialogDescription>
										Добавьте информацию для подборки
									</DialogDescription>
								</DialogHeader>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										id='edit-playlist'
										className='flex flex-col gap-4'
									>
										<FormField
											control={form.control}
											name='name'
											render={({ field }) => (
												<FormItem className='w-full'>
													<div className='mb-2 text-[14px]'>Название</div>
													<FormControl>
														<Input
															className='col-span-3 text-[14px]'
															placeholder='Введите название'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<div className='space-y-2'>
											<Label>Добавить фильм</Label>
											<Input
												placeholder='Поиск фильма...'
												className='block px-3 text-lg'
												value={searchValue}
												onChange={e => {
													setSearchValue(e.target.value)
												}}
											/>
										</div>

										<ScrollArea
											className={cn(
												'invisible h-0 w-full rounded-md border transition-all duration-500',
												{
													['visible h-[250px]']:
														films.filter(
															film =>
																film.title
																	.toLowerCase()
																	.includes(searchValue.toLowerCase()) &&
																!item.films.map(f => f.id).includes(film.id)
														).length > 0 && searchValue,
												}
											)}
										>
											<div className='flex flex-col gap-2 p-2'>
												{films
													.filter(
														film =>
															film.title
																.toLowerCase()
																.includes(searchValue.toLowerCase()) &&
															!item.films.map(f => f.id).includes(film.id)
													)
													.map(movie => (
														<Card
															key={movie.id}
															className='rounded-md px-2 py-4'
														>
															<CardDescription className='flex justify-between gap-2 p-0'>
																<div className='text-black'>{movie.title}</div>
																<div>{movie.year}</div>
															</CardDescription>
															<Button
																type='button'
																className='self-end'
																onClick={() => {
																	onAddMovie(movie.id)
																}}
															>
																Добавить
															</Button>
														</Card>
													))}
											</div>
										</ScrollArea>
										{movies.map(film => (
											<Card key={film.id} className='py-4'>
												<CardContent className='flex items-center justify-between'>
													<div>
														<p>{film.title}</p>
														<p>{film.year}</p>
													</div>
													<div>
														{film.genres.map(g => (
															<p key={g.id}>{g.title}</p>
														))}
													</div>
													<Button
														type='button'
														onClick={() => onDeleteMovie(item.id, film.id)}
													>
														Удалить
													</Button>
												</CardContent>
											</Card>
										))}
									</form>
									<DialogFooter>
										<Button
											form='edit-playlist'
											type='submit'
											className='w-full'
										>
											Сохранить
										</Button>
									</DialogFooter>
								</Form>
							</DialogContent>
						</Dialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</CardHeader>
			<CardContent>
				<div className='font-[14px] dark:text-white'>
					{item?.films?.length} фильма
				</div>
			</CardContent>
			<CardFooter>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button className='mt-5 w-full'>Открыть</Button>
					</DialogTrigger>
					<DialogContent className='max-h-[90vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle>{item.title}</DialogTitle>
						</DialogHeader>
						<div className='flex items-center justify-between gap-4'>
							<Input
								value={filterSearchValue}
								onChange={e => setFilterSearchValue(e.target.value)}
								placeholder='Поиск фильма...'
							/>
							<Sheet>
								<SheetTrigger asChild>
									<Button className='px-4'>Фильтры</Button>
								</SheetTrigger>
								<SheetContent className='h-auto gap-1 overflow-y-auto'>
									<SheetHeader className='pb-0'>
										<SheetTitle>Фильтры</SheetTitle>
										<SheetDescription>
											Выберите фильтры, которые хотите применить
										</SheetDescription>
									</SheetHeader>
									<div className='grid gap-4 px-5 py-4'>
										<div className='w-full'>
											<div className='mb-2 text-[14px]'>Название</div>
											<Input
												id='name'
												className='col-span-3 text-[14px]'
												placeholder='Введите название'
												value={name}
												onChange={e => setName(e.target.value)}
											/>
										</div>
										<div className='w-full'>
											<div className='mb-2 text-[14px]'>Жанры</div>
											<div className='grid grid-cols-2 items-center gap-4'>
												{genres.map(item => (
													<div
														key={item.id}
														className='flex items-center space-x-2'
													>
														<Checkbox
															checked={genresState
																.map(g => g.id)
																.includes(item.id)}
															onCheckedChange={checked => {
																if (checked) addGenre(item)
																else removeGenre(item)
															}}
															id={item.id}
														/>
														<Label htmlFor={item.id}>{item.title}</Label>
													</div>
												))}
											</div>
										</div>
										<div className='w-full'>
											<Label className='mb-2 text-[14px]'>Период выпуска</Label>
											<div className='flex items-center gap-4'>
												<Select
													value={String(startYear)}
													onValueChange={onChangeStartYear}
												>
													<SelectTrigger className=''>
														<SelectValue placeholder='Theme' />
													</SelectTrigger>
													<SelectContent>
														{startYears.map(year => (
															<SelectItem key={year + 's'} value={year}>
																{year}
															</SelectItem>
														))}
													</SelectContent>
												</Select>

												<div className='col-span-1 text-center'>-</div>

												<Select
													value={String(endYear)}
													onValueChange={value => setEndYear(+value)}
												>
													<SelectTrigger className=']'>
														<SelectValue placeholder='Theme' />
													</SelectTrigger>
													<SelectContent>
														{endDigits.map(year => (
															<SelectItem key={year + 's'} value={year}>
																{year}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>
									<SheetFooter>
										<Button onClick={clearFilters} variant='secondary'>
											Очистить фильтры
										</Button>

										<SheetClose asChild>
											<Button onClick={() => applyFilters(item.id)}>
												Применить фильтры
											</Button>
										</SheetClose>
									</SheetFooter>
								</SheetContent>
							</Sheet>
						</div>
						<div className='mt-4 flex flex-col gap-4'>
							{movies
								.filter(film =>
									film.title
										.toLowerCase()
										.includes(filterSearchValue.toLowerCase())
								)
								.map(film => (
									<Card key={film.id} className='py-4'>
										<CardContent className='flex items-center justify-between'>
											<div>
												<p>{film.title}</p>
												<p>{film.year}</p>
											</div>
											<div>
												{film.genres.map(g => (
													<p key={g.id}>{g.title}</p>
												))}
											</div>
											{film.is_viewed && (
												<Button
													variant='outline'
													onClick={() => onDeleteWatch(film.id)}
												>
													Просмотрено
												</Button>
											)}
											{!film.is_viewed && (
												<Button onClick={() => onWatch(film.id)}>
													Просмотреть
												</Button>
											)}
										</CardContent>
									</Card>
								))}
						</div>
					</DialogContent>
				</Dialog>
			</CardFooter>
		</Card>
	)
}
