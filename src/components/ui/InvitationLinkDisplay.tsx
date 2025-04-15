'use client'

import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { CopyIcon } from 'lucide-react'

export default function InvitationLinkDisplay({ link }: { link: string }) {
	return (
		<div className='flex flex-row space-y-2'>
			<Label className='text-md mr-4 translate-y-0.5 font-bold'>
				Ссылка-приглашение:{' '}
			</Label>
			<Popover>
				<PopoverTrigger asChild>
					<div
						className='flex items-center space-x-2'
						onClick={() => navigator?.clipboard?.writeText(link)}
					>
						<div className='flex max-w-[300px] cursor-pointer items-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-1 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white'>
							<div className='hidden truncate md:inline lg:inline'>{link}</div>
							<div className='inline md:hidden lg:hidden'>ссылка</div>
							<CopyIcon className='size-5' />
						</div>
					</div>
				</PopoverTrigger>
				<PopoverContent className='m-0 w-40 p-2'>
					<div className='text-center'>Скопировано!</div>
				</PopoverContent>
			</Popover>
		</div>
	)
}
