import './globals.css'
import { Providers } from '@/src/app/Providers'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Т-Фильмы',
	description:
		'Удобный сервис для сохранения фильмов, чтобы не забыть их посмотреть',
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-[#f6f7f8] antialiased dark:bg-[#212121]`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
