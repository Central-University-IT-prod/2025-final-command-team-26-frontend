'use client'

import Token from './Token'
import { Suspense } from 'react'

export default function TokenPage() {
	return (
		<Suspense>
			<Token />
		</Suspense>
	)
}
