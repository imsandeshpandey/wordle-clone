import { FC } from "react"
import { Button } from "./components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog"
import correct from "@/assets/svgs/correct.svg"
import partial from "@/assets/svgs/partial.svg"
import incorrect from "@/assets/svgs/incorrect.svg"
import { atomWithStorage } from "jotai/utils"
import { useAtom } from "jotai"

const onBoardedAtom = atomWithStorage("onBoarded", false)
const examples = [
  {
    image: correct,
    alt: "Correct",
    char: "A",
    description: "is in the word and in the correct spot.",
  },
  {
    image: partial,
    alt: "Partial",
    char: "L",
    description: "is in the word but in the wrong spot.",
  },
  {
    image: incorrect,
    alt: "Incorrect",
    char: "E",
    description: "is not in any spot.",
  },
]
export const OnBoarding: FC = () => {
  const [, setOnBoarded] = useAtom(onBoardedAtom)
  const onBoarded = localStorage.getItem("onBoarded") === "true"

  return (
    <Dialog open={!onBoarded} onOpenChange={() => setOnBoarded(true)}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="mb-4 text-3xl font-bold">
            How To Play
          </DialogTitle>
          <h2 className="text-lg font-semibold">
            Guess the Wordle in 6 tries.
          </h2>
          <ul className="ml-4 list-disc text-sm">
            <li>Each guess must be a valid 5-letter word.</li>
            <li>
              The color of the tiles will change to show how close your guess
              was to the word.
            </li>
          </ul>
        </DialogHeader>
        <h3 className="text-xl font-bold">Examples</h3>
        {examples.map(({ image, alt, char, description }, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <img src={image} alt={alt} className="h-14 w-fit" />
            <p className="mb-2">
              <b>{char}</b> {description}
            </p>
          </div>
        ))}
        <DialogClose asChild>
          <Button className="ml-auto w-fit px-6">Start Playing</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
