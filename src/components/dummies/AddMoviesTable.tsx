'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import FiltersSheet from '@/src/components/dummies/FiltersSheet'
import { useFilmStore } from '@/src/stores/film.store'
import { Film } from '@/src/types/film.types'
import { Genre } from '@/src/types/genre.types'
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AddMoviesTable({
	addMovie,
}: {
	addMovie: (movie: Film) => void
}) {
	const [films, setFilms] = useState<Film[]>()

	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const filmsStore = useFilmStore(state => state.items)

	useEffect(() => {
		setFilms(filmsStore)
	}, [])

	const columns: ColumnDef<Film>[] = [
		{
			accessorKey: 'title',
			header: 'Название',
		},
		{
			accessorKey: 'genres',
			header: 'Жанры',
			cell: ({ row }) => {
				return (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className='w-[30ch] space-x-1 truncate'>
									{/** @ts-ignore */}
									{row
										.getValue('genres')
										.map((genre: Genre) => genre.title)
										.join(', ')}
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{/** @ts-ignore */}
									{row
										.getValue('genres')
										.map((genre: Genre) => genre.title)
										.join(', ')}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)
			},
		},
		{
			accessorKey: 'year',
			header: 'Год выпуска',
		},
		{
			accessorKey: 'actions',
			header: '',
			cell: ({ row }) => {
				return (
					<div className='flex items-center justify-end gap-2'>
						<Button
							variant='ghost'
							className='btn btn-primary btn-sm cursor-pointer'
							onClick={() => {
								addMovie(row.original)
								console.log(row.original)
								setFilms(prev =>
									prev?.filter(f => f.title !== row.original.title)
								)
							}}
						>
							<Plus />
						</Button>
					</div>
				)
			},
		},
	]

	const table = useReactTable({
		data: films as Film[],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	if (window.innerWidth < 768) {
		columns.splice(1, 2)
	}

	return (
		<div className='w-full'>
			<div className='text-lg font-bold'>Добавить фильмы</div>
			<div className='flex items-center justify-between py-2'>
				<Input
					placeholder='Поиск по названию...'
					value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('title')?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
				<FiltersSheet />
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									Ничего не найдено
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
