'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Cookies from 'js-cookie'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

export default function Profile() {
	const token = Cookies.get('token')
	const { replace } = useRouter()
	const { setTheme, theme } = useTheme()

	const onLogout = () => {
		Cookies.remove('token')
		replace('/login')
	}

	if (token)
		return (
			<div className='flex items-center gap-2'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline'>Профиль</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<a
								className='block h-full w-full'
								href='https://t.me/tfilms_support_bot'
								target='_blank'
							>
								Поддержка
							</a>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={onLogout}>Выйти</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Button
					onClick={() => {
						if (theme === 'dark') setTheme('light')
						else setTheme('dark')
					}}
					variant='outline'
					size='icon'
				>
					{theme === 'light' && (
						<Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 stroke-black transition-all dark:scale-0 dark:-rotate-90' />
					)}
					{theme === 'dark' && (
						<Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 stroke-white transition-all dark:scale-100 dark:rotate-0' />
					)}
					<span className='sr-only'>Переключить тему</span>
				</Button>
			</div>
		)

	return null
}
