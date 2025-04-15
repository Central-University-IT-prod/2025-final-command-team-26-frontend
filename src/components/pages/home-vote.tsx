'use client'

import StartVote from '../dummies/StartVote'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

export default function HomeVotePage() {
	return (
		<main className='flex h-screen w-screen flex-col items-center justify-center gap-5'>
			<Card>
				<CardHeader className='text-center'>
					<CardTitle className='mb-4 text-2xl font-bold'>
						Голосование за фильм
					</CardTitle>
					<CardDescription className='mb-2 text-sm text-gray-400'>
						Начните голосование за выбор фильмы без входа в аккаунт
					</CardDescription>
					<StartVote />
				</CardHeader>
			</Card>
			<p className='text-gray-400'>или</p>
			<Link href={'/login'}>
				<Button variant='outline'>Авторизоваться</Button>
			</Link>
		</main>
	)
}
