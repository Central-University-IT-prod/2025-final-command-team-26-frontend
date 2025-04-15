'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ToggleTheme() {
	const { setTheme, theme } = useTheme()

	return (
		<Button
			onClick={() => {
				if (theme === 'dark') setTheme('light')
				else setTheme('dark')
			}}
			variant='outline'
			size='icon'
			className='ml-4'
		>
			<Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
			<Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	)
}
