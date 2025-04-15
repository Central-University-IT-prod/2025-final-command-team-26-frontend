'use client'

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
import { Input } from '@/components/ui/input'
import { api } from '@/src/api/api'
import { useVoteStore } from '@/src/stores/vote.store'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function StartVote() {
	const { push } = useRouter()
	const [title, setTitle] = useState('')
	// const [name, setName] = useState('')
	const { login, setLogin } = useVoteStore()
	const token = Cookies.get('token')

	const { mutateAsync } = useMutation({
		mutationFn: async () =>
			await api.post('/rooms', {
				title,
				...(!token && { owner_login: login }),
			}),
	})

	const onClick = () => {
		mutateAsync().then(response => {
			if (response.data.id && response.status === 200) {
				localStorage.setItem('ownerId', response.data.users[0].id)
				push(`/vote/${response.data.id}`)
			}
		})
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Начать голосование</Button>
			</DialogTrigger>
			<DialogContent className='top-[300px] sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Начать голосование</DialogTitle>
					<DialogDescription>
						Укажите название для комнаты голосования
					</DialogDescription>
				</DialogHeader>
				<div className='flex flex-col gap-2'>
					<Input
						placeholder='Название...'
						className='block px-3 text-lg'
						value={title}
						onChange={e => {
							setTitle(e.target.value)
						}}
					/>
					{!token && (
						<Input
							placeholder='Ваше имя...'
							className='block px-3 text-lg'
							value={login}
							onChange={e => {
								setLogin(e.target.value)
							}}
						/>
					)}
				</div>

				<DialogFooter>
					<Button
						disabled={!(title && (token || login))}
						className='w-full'
						type='submit'
						onClick={onClick}
					>
						Продолжить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
