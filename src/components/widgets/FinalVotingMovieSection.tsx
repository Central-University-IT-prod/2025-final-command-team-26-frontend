import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function FinalVotingMovieSection({movie, isOpen, onSubmit} : {movie: string, isOpen:boolean,
	onSubmit: () => void}) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px] noCloseable">
				<DialogHeader className="text-left">
					<DialogTitle className="underline">Результаты голосования</DialogTitle>
				</DialogHeader>
				<div className="flex items-center justify-center">
					<div className="block">
						<div className="text-lg text-center mb-2">Победитель: </div>
						<div className="flex flex-col items-center justify-center px-0 py-2 md:p-4 lg:p-4">
							<div className="text-center font-bold text-lg">{movie}</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button className="w-full" onClick={onSubmit}>На главную</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
} 