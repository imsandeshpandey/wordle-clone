import { FC, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { GameStatus } from "../config/game.config"
import { Confetti } from "../assets/confetti"

const { WON, LOST } = GameStatus
type ResultsProps = {
  gameStatus: GameStatus
  gameWord: string
  action: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
export const Results: FC<ResultsProps> = ({ gameStatus, gameWord, action }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (buttonRef.current) buttonRef.current.focus()
  }, [])
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm animate-in zoom-in-50">
      <div className="flex flex-col gap-1">
        {gameStatus === LOST && (
          <p className="text-4xl font-bold">
            Game Over <br />
            <span className="text-xl">The word was {gameWord}</span>
          </p>
        )}
        {gameStatus === WON && (
          <div className="flex flex-col items-center gap-2">
            <Confetti className="ml-20 h-40 w-40" />
            <p className="text-4xl font-bold">You Won!</p>
          </div>
        )}
        <Button ref={buttonRef} onClick={action}>
          Play Again
        </Button>
      </div>
    </div>
  )
}
