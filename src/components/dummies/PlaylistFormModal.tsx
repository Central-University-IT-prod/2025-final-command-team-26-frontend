'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { api } from '@/src/api/api'
import { queryClient } from '@/src/app/Providers'
import { useFilmStore } from '@/src/stores/film.store'
import { Film } from '@/src/types/film.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	name: z.string().min(1, {
		message: 'Укажите название',
	}),
})

export default function PlaylistFormModal() {
	const [open, setOpen] = useState(false)

	const [movies, setMovies] = useState<Film[]>([])
	const [addedMovies, setAddedMovies] = useState<Film[]>([])
	const stateMovies = useFilmStore(state => state.items)

	useEffect(() => {
		setMovies(stateMovies)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	const { mutateAsync } = useMutation({
		mutationFn: async (title: string) =>
			await api.post('/playlists', {
				title,
				films: addedMovies.map(m => m.id),
			}),
		onSuccess: () => {
			toast('Подборка создана')
			queryClient.invalidateQueries({
				queryKey: ['playlists'],
			})
			setOpen(false)
		},
	})

	function onSubmit(data: z.infer<typeof formSchema>) {
		mutateAsync(data.name)
	}

	const addMovie = (movie: Film) => {
		setMovies(prev => prev.filter(i => i.id !== movie.id))
		setAddedMovies(prev => [...prev, movie])
	}
	const removeMovie = (movie: Film) => {
		setAddedMovies(prev => prev.filter(i => i.id !== movie.id))
		setMovies(prev => [...prev, movie])
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="px-2 md:px-4 lg:px-4">
					<div className="hidden md:inline lg:inline">Добавить подборку</div>
					<div className="inline md:hidden lg:hidden"><Plus></Plus></div>
				</Button>
			</DialogTrigger>
			<DialogContent className='max-h-[90vh] max-w-[600px] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='text-lg font-bold'>
						Добавить плейлист
					</DialogTitle>
					<DialogDescription>
						Заполните информацию о плейлисте
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='grid gap-4 py-4'
						id='create-playlist'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Название</FormLabel>
									<FormControl>
										<Input placeholder='Введите название' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[100px]'>Название</TableHead>
							<TableHead>Год</TableHead>
							<TableHead>Жанры</TableHead>
							<TableHead className='text-right'></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{movies.map(movie => (
							<TableRow key={movie.id}>
								<TableCell className='max-w-[100px] truncate font-medium whitespace-normal'>
									{movie.title}
								</TableCell>
								<TableCell>{movie.year}</TableCell>
								<TableCell className='flex flex-wrap gap-1'>
									{movie.genres.map(genre => (
										<Badge key={genre.id}>{genre.title}</Badge>
									))}
								</TableCell>
								<TableCell className='text-right'>
									<Button
										onClick={() => addMovie(movie)}
										className='size-10'
										variant={'ghost'}
									>
										<Plus />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<div className='text-lg font-bold'>Список добавленных фильмов</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[100px]'>Название</TableHead>
							<TableHead>Год</TableHead>
							<TableHead>Жанры</TableHead>
							<TableHead className='text-right'></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{addedMovies.map(movie => (
							<TableRow key={movie.id}>
								<TableCell className='max-w-[100px] truncate font-medium whitespace-normal'>
									{movie.title}
								</TableCell>
								<TableCell>{movie.year}</TableCell>
								<TableCell className='flex flex-wrap gap-1'>
									{movie.genres.map(genre => (
										<Badge key={genre.id}>{genre.title}</Badge>
									))}
								</TableCell>
								<TableCell className='text-right'>
									<Button
										onClick={() => removeMovie(movie)}
										className='size-10'
										variant={'ghost'}
									>
										<Minus />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<DialogFooter>
					<Button
						disabled={!addedMovies.length}
						type='submit'
						form='create-playlist'
					>
						Сохранить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
