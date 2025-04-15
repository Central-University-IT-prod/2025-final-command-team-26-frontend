import VotePage from '@/src/components/pages/VotePage'

export default async function page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return <VotePage id={id} />
}
