'use client'

import Container from '../ui/container'
import Profile from './profile'
import Logo from '@/src/assets/logo-dark.svg'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

const ProfileNoSSR = dynamic(() => Promise.resolve(Profile), {
	ssr: false,
})

export default function Header() {
	return (
		<header className='gap-8 rounded-md bg-white p-5 shadow-md dark:bg-black'>
			<Container className='px-0'>
				<main className='flex items-center justify-between'>
					<Link href={'/'} className='text-xl font-semibold'>
						<Image src={Logo} alt='Logo' width={100} height={40} />
					</Link>
					<ProfileNoSSR />
				</main>
			</Container>
		</header>
	)
}
