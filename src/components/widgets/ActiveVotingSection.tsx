'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useState } from 'react'

export default function ActiveVotingSection({
	roundNumber,
	movies,

	timerTime,
	onVote,
}: {
	roundNumber: number
	movies: { id: string; title: string }[]

	timerTime: number
	onVote: (id: string) => void
}) {
	const [selectedMovieId, setSelectedMovieId] = useState('')
	const [isFinalChoose, setIsFinalChoose] = useState(false)
	const [isRunning, setIsRunning] = useState(true)
	const [timeLeft, setTimeLeft] = useState(timerTime)

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prevTime => {
				if (prevTime <= 0) {
					clearInterval(timer)
					setIsRunning(false)
					return 0
				}
				return prevTime - 0.01
			})
		}, 10)

		return () => clearInterval(timer)
	}, [isRunning])

	const progress = (timeLeft / timerTime) * 100

	return (
		<div className='mt-10 flex w-full flex-col justify-center'>
			<div className='mb-4 text-center text-2xl font-bold'>
				Голосование за фильм
			</div>
			<div className='flex flex-col items-center justify-center p-4'>
				<div className='w-full max-w-md rounded-lg p-6 shadow-lg dark:bg-[#1F1F1F]'>
					<div className='mb-4'>
						<Progress value={progress} />
					</div>
					<h2 className='mb-4 text-xl font-bold'>Раунд {roundNumber}</h2>
					<p className='mb-6'>
						Выберите фильм, который вы бы хотели посмотреть больше всего
					</p>
					<div className='space-y-4'>
						<ScrollArea className='h-[230px]'>
							{movies.map((movie, index) =>
								movie.id != selectedMovieId ? (
									<div
										onClick={() => {
											if (isFinalChoose) return
											setSelectedMovieId(movie.id)
										}}
										className='mt-2 flex w-full cursor-pointer flex-row items-center space-x-2 rounded-md border border-gray-300 p-2 hover:bg-gray-50 dark:hover:bg-gray-800'
										key={index}
									>
										{movie.title}
									</div>
								) : (
									<div
										className='mt-2 flex w-full cursor-pointer flex-row items-center space-x-2 rounded-md border border-gray-300 bg-[#1F1F1F] p-2 text-white dark:bg-white dark:text-black'
										key={index}
									>
										{movie.title}
									</div>
								)
							)}
						</ScrollArea>
						{selectedMovieId && !isFinalChoose && (
							<Button
								className='w-full'
								variant='outline'
								onClick={() => {
									setIsFinalChoose(true)
									onVote(selectedMovieId)
								}}
							>
								Подтвердить выбор
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
