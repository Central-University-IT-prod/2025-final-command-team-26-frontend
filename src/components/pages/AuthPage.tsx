import AuthForm from '@/src/components/dummies/AuthForm'
import { Suspense } from 'react'

export default function AuthPage() {
	return (
		<Suspense>
			<div className='flex h-screen w-screen items-center justify-center'>
				<AuthForm />
			</div>
		</Suspense>
	)
}
