'use client'

import { Progress } from '@/components/ui/progress'
import { useEffect, useState } from 'react'

export default function VotingStatisticSection({
	statistic,
	roundNumber,
	onEnd,
	timerTime,
}: {
	statistic: { id: number; title: string; votes: number }[]
	roundNumber: number
	onEnd: () => void
	timerTime: number
}) {
	const [isRunning, setIsRunning] = useState(true)
	const [timeLeft, setTimeLeft] = useState(timerTime)

	useEffect(() => {
		if (!isRunning) {
			onEnd()
			return
		}
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

	const allVotes = statistic.reduce((total, movie) => total + movie.votes, 0)

	return (
		<div className='flex w-full flex-col justify-center'>
			<div className='mb-2 text-center text-2xl font-bold'>Перерыв</div>
			<div className='flex flex-col items-center justify-center px-0 py-2 md:p-4 lg:p-4'>
				<div className='w-full max-w-md rounded-lg px-2 shadow-lg md:p-6 lg:p-6 dark:bg-[#1F1F1F]'>
					<hr className='md:hidden lg:hidden' />
					<h2 className='my-4 text-xl font-bold'> {roundNumber}</h2>
					<div className='mb-4 space-y-4'>
						<Progress value={progress} />
						<div className='flex flex-col gap-1'>
							{statistic.map((movie, index) => (
								<div
									className='relative h-10 w-full overflow-hidden rounded-sm'
									style={{ backgroundColor: '#90a1b9' }}
									key={index}
								>
									<div
										className='absolute size-full'
										style={{
											width: '' + ((movie.votes / allVotes) * 100 + 20) + '%',
											backgroundColor: '#0f172b',
										}}
									></div>
									<div className='absolute z-10 flex size-full w-full flex-row items-center justify-between px-4 text-right'>
										<div className='text-white dark:text-black'>
											{movie.title}
										</div>
										<div className='text-white dark:text-black'>
											Голосов: {movie.votes}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
