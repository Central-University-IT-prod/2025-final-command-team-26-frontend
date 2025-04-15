'use client'

import { Button } from '@/components/ui/button'
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/src/api/api'
import { queryClient } from '@/src/app/Providers'
import { useGenreStore } from '@/src/stores/genre.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useState } from 'react'
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
			message: 'Укажите категорию для фильма',
		})
		.min(1, {
			message: 'Укажите категорию для фильма',
		}),
	note: z.string().optional(),
	year: z.string().optional(),
})

export default function CreateMovieDialog({
	setExternalOpen,
}: {
	setExternalOpen?: Dispatch<SetStateAction<boolean>>
}) {
	const [open, setOpen] = useState(false)

	const genres = useGenreStore(state => state.items)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			genres: [],
			year: '',
		},
	})

	const { mutateAsync } = useMutation({
		mutationFn: async (data: z.infer<typeof formSchema>) =>
			await api.post('/user/films', {
				...data,
				year: data.year ? data.year : null,
			}),
		onSuccess: () => {
			setOpen(false)
			queryClient.invalidateQueries({
				queryKey: ['films'],
			})
			form.reset()
			toast('Фильм добавлен')
			setExternalOpen?.(false)
		},
		onError: () => {
			toast('Ошибка создания')
		},
	})

	function onSubmit(data: z.infer<typeof formSchema>) {
		mutateAsync(data)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='mt-10 w-full'>Добавить фильм самостоятельно</Button>
			</DialogTrigger>
			<DialogContent className='max-h-[90vh] max-w-[100%] overflow-y-auto'>
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
									<FormLabel className='text-base'>Жанры</FormLabel>

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
																	id={item.id}
																	checked={field.value?.includes(item.id)}
																	onCheckedChange={checked => {
																		const valueArray = field.value ?? []

																		return checked
																			? field.onChange([...valueArray, item.id])
																			: field.onChange(
																					field?.value?.filter(
																						(value: string) => value !== item.id
																					)
																				)
																	}}
																/>
															</FormControl>
															<Label htmlFor={item.id}>{item.title}</Label>
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
									<div className='mb-2 text-[14px]'>Год выпуска</div>
									<FormControl>
										<Input
											id='date'
											className='col-span-3 text-[14px]'
											placeholder='Введите год выпуска'
											{...field}
											onChange={e => {
												field.onChange(e.target.value.replace(/[^0-9]/g, ''))
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
										<Textarea placeholder='Напишите заметку' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
					<DialogFooter>
						<Button form='save-your-film' type='submit' className='w-full'>
							Сохранить
						</Button>
					</DialogFooter>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
