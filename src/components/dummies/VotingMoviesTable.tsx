import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'

export default function VotingMoviesTable({
	movies,
}: {
	movies: { title: string }[]
}) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead></TableHead>
					<TableHead>Название</TableHead>
					<TableHead className='hidden md:table-cell lg:table-cell'>
						Жанры
					</TableHead>
					<TableHead className='hidden text-right md:table-cell lg:block'>
						Год выпуска
					</TableHead>
					<TableHead className='text-right'>Автор</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{movies.map((movie, index) => (
					<TableRow key={index}>
						<TableCell>{movie?.title}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
