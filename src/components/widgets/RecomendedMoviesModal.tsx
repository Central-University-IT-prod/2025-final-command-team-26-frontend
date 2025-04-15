'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Film } from '@/src/types/film.types'

export default function RecommendedMoviesModal({
	movies,
	onClose,
	isOpen,
}: {
	movies: Film[]
	onClose: () => void
	isOpen: boolean
}) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className='noCloseable'>
				<DialogHeader>
					<DialogTitle>Три рекомендованных фильма</DialogTitle>
				</DialogHeader>
				<div className='flex flex-col gap-1'>
					{movies.map((movie, index) => (
						<Card className='w-full gap-1 py-1' key={index}>
							<CardHeader>
								<CardTitle className='text-md dark:text-white'>
									{movie.title}
								</CardTitle>
								<CardDescription className='text-black dark:text-white'>
									{movie.year}
								</CardDescription>
							</CardHeader>
							<CardContent className='py-1'>
								<div className='font-sm dark:text-white'>
									{
										//@ts-ignore
										movie.genre.map(
											//@ts-ignore
											(genre, index) =>
												//@ts-ignore
												genre + (index < movie.genre.length - 1 ? ', ' : '')
										)
									}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
				<DialogFooter>
					<Button className='w-full' onClick={() => onClose()}>
						Закрыть
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
