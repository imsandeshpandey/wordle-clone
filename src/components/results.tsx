import { FC, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { GameMode, GameStatus } from "../config/game.config"
import { Confetti } from "../assets/confetti"
import { Dices } from "lucide-react"

const { WON, LOST } = GameStatus
type ResultsProps = {
  gameMode: GameMode
  gameStatus: GameStatus
  gameWord: string
  action: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
export const Results: FC<ResultsProps> = ({
  gameMode,
  gameStatus,
  gameWord,
  action,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (buttonRef.current) buttonRef.current.focus()
  }, [])
  const isToday = gameMode === GameMode.TODAY
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm animate-in zoom-in-50">
      <div className="flex flex-col items-center gap-1">
        {gameStatus === LOST && (
          <>
            <p className="text-4xl font-bold">
              Game Over! <br />
              {!isToday && (
                <span className="text-xl">The word was {gameWord}</span>
              )}
            </p>
            {isToday && <Button onClick={action}>Try Again</Button>}
          </>
        )}

        {gameStatus === WON && (
          <>
            <Confetti className="ml-20 h-40 w-40" />
            <h1 className="text-4xl font-bold">You Won!</h1>
            {isToday && <p>You solved today's Wordle!</p>}
            <Button
              ref={buttonRef}
              className="gap-2"
              onClick={(e) => {
                if (!isToday) return action(e)
                window.location.pathname = "/random"
              }}
            >
              {isToday && <Dices />}
              {isToday ? "Play a random Wordle" : "Play Again"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
