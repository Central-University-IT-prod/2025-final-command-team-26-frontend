'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { useFilterStore } from '@/src/stores/filter.store'
import { useGenreStore } from '@/src/stores/genre.store'
import { useEffect, useState } from 'react'

const startYears: string[] = []

for (let i = 2025; i >= 1900; i--) {
	startYears.push(String(i))
}

export default function FiltersSheet() {
	const [endDigits, setEndDigits] = useState(startYears)

	const genres = useGenreStore(state => state.items)

	const setStartYear = useFilterStore(state => state.setStartYear)

	const onChangeStartYear = (value: string) => {
		setStartYear(+value)
		setEndDigits(startYears.filter(end => end >= value))
	}

	const setEndYear = useFilterStore(state => state.setEndYear)

	const endYear = useFilterStore(state => state.endYear)
	const startYear = useFilterStore(state => state.startYear)

	const clearFilters = useFilterStore(state => state.clear)

	const name = useFilterStore(state => state.name)
	const setName = useFilterStore(state => state.setName)

	const genresState = useFilterStore(state => state.genres)
	const addGenre = useFilterStore(state => state.addGenre)
	const removeGenre = useFilterStore(state => state.removeGenre)

	const applyFilters = useFilterStore(state => state.applyFilters)

	useEffect(() => {
		setEndDigits(startYears.filter(end => +end >= startYear!))
	}, [startYear])

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className='px-4'>Фильтры</Button>
			</SheetTrigger>
			<SheetContent className='h-auto gap-1 overflow-y-auto w-full md:w-(--container-sm) 
			lg:w-(--container-md)'>
				<SheetHeader className='pb-0'>
					<SheetTitle>Фильтры</SheetTitle>
					<SheetDescription>
						Выберите фильтры, которые хотите применить
					</SheetDescription>
				</SheetHeader>
				<div className='grid gap-4 px-5 py-4'>
					<div className='w-[80%]'>
						<div className='mb-2 text-[14px]'>Название</div>
						<Input
							id='name'
							className='col-span-3 text-[14px]'
							placeholder='Введите название'
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</div>
					<div className='w-full'>
						<div className='mb-2 text-[14px]'>Жанры</div>
						<div className='grid grid-cols-2 items-center gap-4'>
							{genres.map(item => (
								<div key={item.id} className='flex items-center space-x-2'>
									<Checkbox
										checked={genresState.map(g => g.id).includes(item.id)}
										onCheckedChange={checked => {
											if (checked) addGenre(item)
											else removeGenre(item)
										}}
										id={item.id}
									/>
									<Label htmlFor={item.id}>{item.title}</Label>
								</div>
							))}
						</div>
					</div>
					<div className='w-full'>
						<Label className='mb-2 text-[14px]'>Период выпуска</Label>
						<div className='flex items-center gap-4'>
							<Select
								value={String(startYear)}
								onValueChange={onChangeStartYear}
							>
								<SelectTrigger className=''>
									<SelectValue placeholder='Theme' />
								</SelectTrigger>
								<SelectContent>
									{startYears.map(year => (
										<SelectItem key={year + 's'} value={year}>
											{year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<div className='col-span-1 text-center'>-</div>

							<Select
								value={String(endYear)}
								onValueChange={value => setEndYear(+value)}
							>
								<SelectTrigger className=']'>
									<SelectValue placeholder='Theme' />
								</SelectTrigger>
								<SelectContent>
									{endDigits.map(year => (
										<SelectItem key={year + 's'} value={year}>
											{year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<SheetFooter>
					<Button onClick={clearFilters} variant='secondary'>
						Очистить фильтры
					</Button>

					<SheetClose asChild>
						<Button onClick={applyFilters}>Сохранить изменения</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
