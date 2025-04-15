import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Film } from '@/src/types/film.types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Genre } from '@/src/types/genre.types'

export default function MoviesList({ movies }: { movies: Film[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className='w-[100px]'>Название</TableHead>
					<TableHead className="hidden md:table-cell lg:table-cell">Жанры</TableHead>
					<TableHead className='text-right hidden md:table-cell lg:table-cell'>Год выпуска</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{movies.map((movie, index) => (
					<TableRow key={index}>
						<TableCell className='font-medium'>{movie.title}</TableCell>
						<TableCell className="space-x-1 hidden md:table-cell lg:table-cell">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="space-x-1 w-[30ch] truncate">
											{/** @ts-ignore */}
											{movie.genres.map((genre: Genre) => (genre.title)).join(', ')}
										</div>
									</TooltipTrigger>
									<TooltipContent>
										{/** @ts-ignore */}
										<p>{movie.genres.map((genre: Genre) => (genre.title)).join(', ')}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</TableCell>
						<TableCell className='text-right hidden md:table-cell lg:table-cell'>{movie.year}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
