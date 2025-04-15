'use client'

import { Badge } from '@/components/ui/badge'
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
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/src/api/api'
import { queryClient } from '@/src/app/Providers'
import { useGenreStore } from '@/src/stores/genre.store'
import { Film } from '@/src/types/film.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	title: z.string().min(2, { message: 'Укажите название' }).max(50, {
		message: 'Максимум 50 символов',
	}),
	link: z
		.string()
		.refine(
			value => value === '' || z.string().url().safeParse(value).success,
			{
				message: 'Некорректная ссылка',
			}
		)
		.optional(),
	genres: z
		//@ts-ignore
		.array(z.enum(useGenreStore.getState().items.map(g => g.id)), {
			message: 'Укажите категорию для упражнения',
		})
		.min(1, {
			message: 'Укажите категорию для упражнения',
		}),
	note: z.string().optional(),
	year: z.string().optional(),
})

export default function SavedMovieCard({
	movie,
	onClick,
	btnText,
}: {
	movie: Film
	onClick: (id: string) => void
	btnText: string
}) {
	const { mutateAsync: deleteMovie } = useMutation({
		mutationFn: async () => await api.delete(`/user/films/${movie.id}`),
		onSuccess: () => {
			queryClient.invalidateQueries()
			toast('Фильм удалён')
		},
	})

	const onDelete = () => {
		deleteMovie()
	}

	const [open, setOpen] = useState(false)

	const genres = useGenreStore(state => state.items)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: movie.title,
			genres: movie.genres.map(g => g.id),
			year: movie.year ? String(movie.year) : '',
			link: movie.link ?? '',
			note: movie.note ?? undefined,
		},
		mode: 'onChange',
	})

	const { mutateAsync: editMovie } = useMutation({
		mutationFn: async (data: z.infer<typeof formSchema>) =>
			await api.patch(`/user/films/${movie.id}`, {
				...data,
				year: data.year ? data.year : undefined,
				link: data.link ? data.link : undefined,
			}),
		onSuccess: () => {
			setOpen(false)
			queryClient.invalidateQueries({
				queryKey: ['films'],
			})
			toast('Фильм сохранён')
		},
		onError: () => {
			toast('Ошибка сохранения')
			setOpen(false)
		},
	})

	function onSubmit(data: z.infer<typeof formSchema>) {
		editMovie(data)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Card className='flex cursor-pointer flex-col justify-between gap-2 bg-white transition-colors hover:bg-[#EEE] dark:bg-[#333] dark:hover:bg-[#3c3c3c]'>
					<CardHeader>
						<div className='flex items-center justify-between'>
							<CardTitle className='text-[20px] dark:text-white'>
								Фильм
							</CardTitle>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' className='size-10'>
										<Menu />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									onClick={e => {
										e.stopPropagation()
									}}
								>
									<DropdownMenuItem
										onClick={e => {
											e.stopPropagation()
											onDelete()
										}}
									>
										Удалить
									</DropdownMenuItem>
									<Dialog open={open} onOpenChange={setOpen}>
										<DialogTrigger asChild>
											<DropdownMenuItem
												onSelect={e => {
													e.stopPropagation()
													e.preventDefault()
												}}
											>
												Изменить
											</DropdownMenuItem>
										</DialogTrigger>
										<DialogContent className='max-h-[90vh] overflow-y-auto'>
											<DialogHeader>
												<DialogTitle>Создать фильм</DialogTitle>
												<DialogDescription>
													Добавьте информацию самостоятельно для фильма
												</DialogDescription>
											</DialogHeader>

											<Form {...form}>
												<form
													onSubmit={form.handleSubmit(onSubmit)}
													id='save-your-film'
													className='flex flex-col gap-4'
												>
													<FormField
														control={form.control}
														name='title'
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
													<FormField
														control={form.control}
														name={'genres'}
														render={() => (
															<FormItem>
																<FormLabel className='text-base'>
																	Жанры
																</FormLabel>

																<div className='grid grid-cols-2 gap-2'>
																	{genres.map(item => (
																		<FormField
																			key={item.id}
																			control={form.control}
																			name={'genres'}
																			render={({ field }) => {
																				return (
																					<FormItem
																						key={item.id}
																						className='flex flex-row items-start space-y-0 space-x-3'
																					>
																						<FormControl>
																							<Checkbox
																								checked={field.value?.includes(
																									item.id
																								)}
																								onCheckedChange={checked => {
																									const valueArray =
																										field.value ?? []

																									return checked
																										? field.onChange([
																												...valueArray,
																												item.id,
																											])
																										: field.onChange(
																												field?.value?.filter(
																													(value: string) =>
																														value !== item.id
																												)
																											)
																								}}
																							/>
																						</FormControl>
																						<FormLabel className='text-sm font-normal'>
																							{item.title}
																						</FormLabel>
																					</FormItem>
																				)
																			}}
																		/>
																	))}
																</div>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name='year'
														render={({ field }) => (
															<div className='w-full'>
																<div className='mb-2 text-[14px]'>
																	Год выпуска
																</div>
																<FormControl>
																	<Input
																		className='col-span-3 text-[14px]'
																		placeholder='Введите год выпуска'
																		{...field}
																		onChange={e => {
																			field.onChange(
																				e.target.value.replace(/[^0-9]/g, '')
																			)
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</div>
														)}
													/>
													<FormField
														control={form.control}
														name='link'
														render={({ field }) => (
															<FormItem className='w-full'>
																<div className='mb-2 text-[14px]'>Ссылка</div>
																<FormControl>
																	<Input
																		className='col-span-3 text-[14px]'
																		placeholder='Введите ссылку'
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name='note'
														render={({ field }) => (
															<FormItem className='w-full'>
																<div className='mb-2 text-[14px]'>Заметка</div>
																<FormControl>
																	<Textarea
																		placeholder='Напишите заметку'
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
														form='save-your-film'
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
						</div>
						{movie.year && (
							<CardDescription className='text-black dark:text-white'>
								{movie.year} г.
							</CardDescription>
						)}
					</CardHeader>
					<CardContent>
						<div className='mb-5 font-[14px] dark:text-white'>
							{movie.title}
						</div>
						<div className='flex flex-wrap gap-1'>
							{movie.genres.map(genre => (
								<Badge key={genre.id}>{genre.title}</Badge>
							))}
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type='button'
							onClick={e => {
								e.stopPropagation()
								onClick(movie.id)
							}}
							className='mt-5 w-full'
						>
							{btnText}
						</Button>
					</CardFooter>
				</Card>
			</DialogTrigger>
			<DialogContent className='max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{movie.title}</DialogTitle>
					<DialogDescription>Информация об этом фильме</DialogDescription>
				</DialogHeader>

				<div className='space-y-2'>
					<div className='mb-2 text-[14px]'>Название</div>
					<p>{movie.title}</p>
				</div>
				<div className='space-y-2'>
					<div className='mb-2 text-[14px]'>Жанры</div>
					<div className='flex flex-wrap gap-1'>
						{movie.genres.map(genre => (
							<Badge key={genre.id}>{genre.title}</Badge>
						))}
					</div>
				</div>
				{movie.year && (
					<div className='space-y-2'>
						<div className='mb-2 text-[14px]'>Год выпуска</div>
						<p>{movie.year}</p>
					</div>
				)}
				{movie.link && (
					<div className='space-y-2'>
						<div className='mb-2 text-[14px]'>Ссылка</div>
						<a href={movie.link} rel='noopener'>
							{movie.link}
						</a>
					</div>
				)}
				{movie.note && (
					<div className='space-y-2'>
						<div className='mb-2 text-[14px]'>Заметка</div>
						<p>{movie.note}</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
