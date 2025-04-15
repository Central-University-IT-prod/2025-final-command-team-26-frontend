'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function VotingNameRequestModal({
	isOpen,
	onSubmit,
}: {
	isOpen: boolean
	onSubmit: (name: string) => void
}) {
	const [name, setName] = useState('')
	const [message, setMessage] = useState('')

	return (
		<Dialog open={isOpen}>
			<DialogContent className='noCloseable sm:max-w-[425px]'>
				<DialogHeader className='text-left'>
					<DialogTitle>Введите имя</DialogTitle>
					<DialogDescription>
						Веденное имя будут видеть участники голосования
					</DialogDescription>
				</DialogHeader>
				<Input
					id='votingNameRequest'
					value={name}
					className='w-fill'
					placeholder='Введите имя'
					onChange={e => setName(e.target.value)}
				/>
				{message != '' && (
					<Label htmlFor='votingNameRequest' className='text-red-500'>
						{message}
					</Label>
				)}
				<DialogFooter>
					<Button
						onClick={() => {
							if (name == '') {
								setMessage('Без имени вы не сможете участвовать')
								return
							}
							if (name.length > 15) {
								setMessage('Имя не должно превышать 15 символов')
								return
							}
							if (name.length < 3) {
								setMessage('Имя не должно быть короче 3 символов')
								return
							}
							onSubmit(name)
						}}
					>
						Сохранить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
