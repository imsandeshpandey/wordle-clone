/* eslint-disable react-hooks/exhaustive-deps */
import { GridView } from "./components/grid-view"
import { Keyboard } from "./components/keyboard-view"
import { Results } from "./components/results"
import { Button } from "./components/ui/button"
import { RefreshCwIcon } from "lucide-react"
import { ModeToggle } from "./components/theme-toggle"
import { useWordle } from "./hooks/use-wordle.ts"
import { FC } from "react"
import { GameMode } from "./config/game.config"
import { InvalidPathPage } from "./components/invalid-path-page.tsx"
import { GameModeToggle } from "./components/game-mode-toggle.tsx"

const pathname = window.location.pathname
let gameMode: GameMode
switch (pathname) {
  case "/":
    gameMode = GameMode.TODAY
    break
  case "/random":
    gameMode = GameMode.RANDOM
    break
  default:
    gameMode = GameMode.INVALID
}

export const App: FC = () => {
  const {
    grid,
    gridRefs,
    gameStatus,
    isGameOver,
    caretPosition,
    rerenderDummyState,
    keysStatus,
    answer,
    restart,
    handleKeyInput,
  } = useWordle(gameMode)

  if (gameMode === GameMode.INVALID) {
    return <InvalidPathPage />
  }

  return (
    <div className="relative mx-auto flex h-full max-h-[1000px] w-fit flex-col items-center justify-center gap-1 py-8 pt-20">
      {isGameOver && (
        <Results
          gameMode={gameMode}
          gameStatus={gameStatus}
          gameWord={answer}
          action={restart}
        />
      )}

      <div className="relative flex w-full flex-1 p-2">
        <div className="absolute inset-0 mx-auto mt-auto flex aspect-[5/6] max-h-full flex-col">
          <GridView
            update={rerenderDummyState}
            refs={gridRefs}
            grid={grid}
            pos={[caretPosition.r, caretPosition.c]}
          />
        </div>
      </div>
      <footer className="mt-4 w-fit">
        <Toolbar restart={restart} />
        <Keyboard keysStatus={keysStatus} onKeyInput={handleKeyInput} />
      </footer>
    </div>
  )
}

export const Toolbar = ({ restart }: { restart: () => void }) => {
  return (
    <div className="mb-2 flex w-full items-center justify-around gap-2 rounded-full border px-4 text-xs font-bold md:text-sm">
      <ModeToggle />
      <span className="mx-2 h-6 w-[1px] bg-foreground/10" />
      <GameModeToggle gameMode={gameMode} />
      <span className="mx-2 h-6 w-[1px] bg-foreground/10" />
      <Button
        variant="ghost"
        className="restart-button group -ml-4 gap-1 px-1 text-xs md:gap-2 md:text-sm"
        onClick={restart}
      >
        <RefreshCwIcon className="rotate-in-90 h-3.5 w-3.5 animate-in md:h-4 md:w-4" />{" "}
        Restart
      </Button>
    </div>
  )
}
