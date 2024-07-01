import { CalendarDays, Dices } from "lucide-react"
import { Button } from "./ui/button"

export const InvalidPathPage = () => {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex flex-col gap-2 px-4">
        <h1 className="mb-8 text-center text-3xl font-bold">
          <span>☹️</span>
          <br />
          Uh oh! Nothing to explore here!
        </h1>
        <p className="font-bold">Go back to Wordle :</p>
        <Button className="gap-2" onClick={() => (window.location.href = "/")}>
          <CalendarDays className="h-5 w-5" /> Today's Wordle
        </Button>
        <Button
          variant="secondary"
          className="gap-2"
          onClick={() => (window.location.href = "/random")}
        >
          <Dices className="h-5 w-5" /> Random Wordle
        </Button>
      </div>
    </div>
  )
}
