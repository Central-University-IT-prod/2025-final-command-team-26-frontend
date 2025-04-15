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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/src/api/api'
import { CLIENT_ID, YANDEX_AUTH_URL } from '@/src/consts/consts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
	username: z
		.string({
			message: 'Укажите логин',
		})
		.regex(/[a-zA-Z0-9_.-]/, 'Только латинские буквы'),
	password: z.string().min(6, {
		message: 'Укажите пароль длиною не менее 6 символов',
	}),
})

export default function RegForm() {
	const { push, replace } = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
		mode: 'onChange',
	})

	const { mutateAsync: register } = useMutation({
		mutationFn: async (data: z.infer<typeof formSchema>) =>
			await api.post('/auth/basic/register', {
				login: data.username,
				password: data.password,
			}),
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		await register(data)
			.then(response => {
				if (response.data.token) {
					Cookies.set('token', response.data.token)
					push('/')
					toast('Успешная регистрация')
				}
			})
			.catch(err => {
				if (err.status === 409) {
					toast('Данный пользователь уже зарегистрирован')
				}
			})
	}

	const handleLogin = () => {
		const authUrl = `${YANDEX_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}`
		replace(authUrl)
	}

	return (
		<Card className='w-auto md:w-[475px] lg:w-[475px]'>
			<CardHeader>
				<CardDescription className='mb-2 text-sm'>
					<Link
						href='/home'
						className='mb-5 flex w-full cursor-pointer items-center gap-1 text-sm'
					>
						<ArrowLeft
							className='stroke-black dark:stroke-white'
							width={16}
							height={16}
							color='black'
						/>
						<p className='text-black dark:text-white'>Назад</p>
					</Link>
				</CardDescription>
				<CardTitle className='mb-4'>Регистрация</CardTitle>
				<CardDescription className='text-sm text-gray-400'>
					Зарегистрируйтесь, чтобы получить доступ к своим сохранённым фильмам с
					любого устройства
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} id='reg-form'>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-2 space-y-1.5'>
								<FormField
									control={form.control}
									name='username'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Логин</FormLabel>
											<FormControl>
												<Input placeholder='Введите логин' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex flex-col gap-2 space-y-1.5'>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Пароль</FormLabel>
											<FormControl>
												<Input
													placeholder='Введите пароль'
													type='password'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='mt-3 flex flex-col gap-2'>
				<Button type='submit' form='reg-form' className='w-full'>
					Зарегистрироваться
				</Button>
				<Button
					className='flex w-full items-center justify-between gap-4 rounded-lg bg-black hover:bg-[#555555] dark:bg-white dark:hover:bg-[#EEE]'
					onClick={handleLogin}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='44'
						height='44'
						viewBox='0 0 44 44'
						fill='none'
						className='size-6 rounded-full bg-red-500'
					>
						<rect width='44' height='44' fill='%23FC3F1D' />
						<path
							d='M24.7407 33.9778H29.0889V9.04443H22.7592C16.3929 9.04443 13.0538 12.303 13.0538 17.1176C13.0538 21.2731 15.2187 23.6163 19.0532 26.1609L21.3832 27.6987L18.3927 25.1907L12.4667 33.9778H17.1818L23.5115 24.5317L21.3098 23.0671C18.6496 21.2731 17.3469 19.8818 17.3469 16.8613C17.3469 14.2068 19.2183 12.4128 22.7776 12.4128H24.7223V33.9778H24.7407Z'
							fill='white'
						/>
					</svg>
					<p className='text-white dark:text-black'>Войти через Яндекс</p>
					<div className='size-6' />
				</Button>
			</CardFooter>
		</Card>
	)
}
