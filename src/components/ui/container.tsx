import { cn } from '@/src/utils/utils'
import { ReactNode } from 'react'

export default function Container({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div className={cn('mx-auto max-w-5xl px-4', className)}>{children}</div>
	)
}
