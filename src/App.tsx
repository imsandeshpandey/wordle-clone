/* eslint-disable react-hooks/exhaustive-deps */
import { GridView } from "./components/grid-view-ref"
import { KeyboardView } from "./components/keyboard-view"
import { Results } from "./components/results"
import { Button } from "./components/ui/button"
import { Info, RefreshCwIcon } from "lucide-react"
import { OnBoarding } from "./components/onboarding"
import { ModeToggle } from "./components/theme-toggle"
import { useWordle } from "./hooks/use-wordle.ts"
import { FC } from "react"
import { GameMode } from "./config/game.config"
import { InvalidPathPage } from "./components/invalid-path-page.tsx"
import { GameModeToggle } from "./components/game-mode-toggle.tsx"
import { Branding } from "./components/branding.tsx"

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
    <div className="relative mx-auto flex h-full max-h-[1080px] w-fit flex-col items-center justify-center gap-1 py-4">
      <div>
        <Branding className="mx-auto mb-8" />
        <div className="flex justify-end">
          <OnBoarding
            trigger={
              <Button
                variant="ghost"
                className="gap-1 text-xs text-muted-foreground"
              >
                <Info className="h-4 w-4" /> How To Play
              </Button>
            }
          />
        </div>
        <GridView
          update={rerenderDummyState}
          refs={gridRefs}
          grid={grid}
          pos={[caretPosition.r, caretPosition.c]}
        />
      </div>
      <div className="mt-4 w-fit">
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
        <KeyboardView keysStatus={keysStatus} onKeyInput={handleKeyInput} />
      </div>
      {isGameOver && (
        <Results
          gameMode={gameMode}
          gameStatus={gameStatus}
          gameWord={answer}
          action={restart}
        />
      )}
    </div>
  )
}
