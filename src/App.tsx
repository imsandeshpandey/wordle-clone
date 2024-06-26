/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { deepCopyGrid, getRandomWord } from "./lib/utils"
import {
  DEFAULT_POS,
  DEFAULT_GRID,
  VALID_CHARS_REGEX,
  GameStatus,
  Accuracy,
  GridViewRef,
} from "./config/game.config"
import { getWordFrequencyMap } from "./lib/utils"
import { GridView } from "./components/grid-view-ref"
import { words } from "./config/words.config"
import { useToast } from "./components/ui/use-toast"
import { KeyboardView } from "./components/keyboard-view"
import { Results } from "./components/results"
import { Button } from "./components/ui/button"
import { RefreshCwIcon, Volume2Icon } from "lucide-react"
import { useSound, volumeAtom } from "./hooks/useSound"
import { VolumeSlider } from "./components/volume-slider"
import { OnBoarding } from "./components/onboarding"
import { ModeToggle } from "./components/theme-toggle"

const { PLAYING, WON, LOST } = GameStatus
const { CORRECT, PARTIAL, INCORRECT } = Accuracy

export const App: FC = () => {
  const playSound = useSound()
  const { toast } = useToast()
  const gridRefs = useRef<GridViewRef>({
    rows: [],
    items: {},
  })
  const keysStatus = useRef<Record<string, Accuracy>>({})
  const gameWord = useRef<string>(getRandomWord())

  const wordFrequencyMap = useMemo(
    () => getWordFrequencyMap(gameWord.current),
    [gameWord.current]
  )
  const [grid, setGrid] = useState(DEFAULT_GRID)
  const [update, setUpdate] = useState(0)
  const [isRevealing, setIsRevealing] = useState(false)
  const [gameStatus, setGameStatus] = useState<GameStatus>(PLAYING)
  const gameOver = gameStatus !== PLAYING

  const position = useRef(DEFAULT_POS)

  const handleLetterInput = (e: { key: string }) => {
    playSound("click")
    if (!e.key.match(VALID_CHARS_REGEX)) return
    const { r, c } = position.current
    if (c > 4) return
    const newGrid = deepCopyGrid(grid)
    newGrid[r][c].char = e.key.toUpperCase()
    setGrid(newGrid)
    updatePos()
  }

  const handleBackspace = () => {
    playSound("click")
    const { r, c } = position.current
    if (c == 0) return
    const newGrid = deepCopyGrid(grid)
    newGrid[r][c - 1].char = ""
    setGrid(newGrid)
    position.current.c -= 1
  }

  const compareWord = () => {
    const { r, c } = position.current
    if (c <= 4) return
    const input = grid[r].map(({ char }) => char)
    if (!words.includes(input.join(""))) {
      toast({
        title: "Word is not in the dictionary!",
        variant: "destructive",
        duration: 3000,
      })
      playSound("error")
      const row = gridRefs.current.rows[r]!
      row.classList.add("animate-shake")
      setTimeout(() => row.classList.remove("animate-shake"), 500)
      return
    }
    const newWordFrequencyMap = new Map(wordFrequencyMap)
    const accuracies: Accuracy[] = []

    for (const idx in input) {
      const char = input[idx]
      if (!newWordFrequencyMap.get(char)) {
        accuracies.push(INCORRECT)
        continue
      }
      const expectedChar = gameWord.current[idx]
      const charCount = newWordFrequencyMap.get(char) || 0
      const accuracy = expectedChar == char ? CORRECT : PARTIAL

      accuracies.push(accuracy)
      newWordFrequencyMap.set(char, charCount - 1)
    }
    revealResults(accuracies, r)
  }
  const revealResults = async (accuracies: number[], row: number) => {
    let totalAccuracy = 0
    setIsRevealing(true)
    for (const idx in accuracies) {
      totalAccuracy += accuracies[idx]
      await new Promise((resolve) => {
        setGrid((prev) => {
          const gridClone = deepCopyGrid(prev)
          gridClone[row][idx].accuracy = accuracies[idx]
          return gridClone
        })
        const char = grid[row][idx].char
        const prevAccuracy = keysStatus.current[char] || 0
        keysStatus.current[char] = Math.max(prevAccuracy, accuracies[idx])
        setTimeout(resolve, 500)
      })
    }
    setIsRevealing(false)
    if (totalAccuracy === 10) {
      setGameStatus(WON)
      playSound("success")
      return
    }
    if (row === grid.length - 1) return setGameStatus(LOST)

    position.current = {
      r: position.current.r + 1,
      c: 0,
    }
    setUpdate(update + 1)
  }

  const handleKeyDown = (e: { key: string }) => {
    if (gameOver) return
    switch (e.key) {
      case "Backspace":
        handleBackspace()
        break
      case "Enter":
        compareWord()
        break
      default:
        handleLetterInput(e)
    }
  }
  const updatePos = () => {
    const pos = position.current
    const newPos = {
      r: pos.r,
      c: pos.c + 1,
    }
    position.current = newPos
  }

  const restart = () => {
    setGrid(DEFAULT_GRID)
    setGameStatus(PLAYING)
    position.current = DEFAULT_POS
    gameWord.current = getRandomWord()
    keysStatus.current = {}
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [grid, position, gameStatus])

  return (
    <div className="relative flex h-full flex-col items-center justify-around gap-1">
      <OnBoarding />
      <div className="mb-2 py-2">
        <h1 className="flex-items-center text-3xl font-bold drop-shadow-md md:text-4xl">
          Wordle
        </h1>

        <p className="float-right ml-auto text-xs font-bold text-muted-foreground">
          by frsty
        </p>
      </div>

      <div>
        <div className="mb-2 flex w-full items-center justify-between">
          <Button
            variant="ghost"
            className="-ml-4 gap-2 text-muted-foreground"
            onClick={restart}
          >
            <RefreshCwIcon className="h-4 w-4" /> Restart
          </Button>
          <div className="flex items-center gap-2">
            <VolumeSlider
              atom={volumeAtom}
              icon={<Volume2Icon className="h-4 w-4" />}
            />
            <ModeToggle />
          </div>
        </div>
        <GridView
          isRevealing={isRevealing}
          key={gameWord.current}
          update={update}
          refs={gridRefs}
          grid={grid}
          pos={[position.current.r, position.current.c]}
        />
      </div>
      <KeyboardView
        keysStatus={keysStatus.current}
        onKeyInput={handleKeyDown}
      />
      {gameOver && (
        <Results
          gameStatus={gameStatus}
          gameWord={gameWord.current}
          action={restart}
        />
      )}
    </div>
  )
}
