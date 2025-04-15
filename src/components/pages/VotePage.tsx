import Header from '../layouts/header'
import Container from '../ui/container'
import VotingPage from './VotingPage'

export default function VotePage({ id }: { id: string }) {
	return (
		<>
			<Header />
			<Container>
				<main className='flex flex-col gap-16'>
					<VotingPage id={id} />
				</main>
			</Container>
		</>
	)
}
