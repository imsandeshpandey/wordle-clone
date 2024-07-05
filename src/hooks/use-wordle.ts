import { useToast } from "@/components/ui/use-toast"
import { useSound } from "./useSound"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Accuracy,
  DEFAULT_GRID,
  DEFAULT_POS,
  GameMode,
  GameStatus,
  GridViewRef,
  VALID_CHARS_REGEX,
} from "@/config/game.config"
import {
  deepCopyGrid,
  getAccuracyArray,
  isValidWord,
  vibrate,
} from "@/lib/utils"
import { VIBRATIONS } from "@/config/vibrations.config"
import { ANIMATIONS } from "@/config/animations.config"
import { getSolution } from "@/lib/utils"

export const useWordle = (gameMode: GameMode) => {
  const playSound = useSound()
  const { toast } = useToast()
  const gridRefs = useRef<GridViewRef>({
    rows: [],
    items: {},
  })
  const keysStatus = useRef<Record<string, Accuracy>>({})
  const answer = useRef<string>("")

  const [grid, setGrid] = useState(DEFAULT_GRID)
  const [dummyUpdate, setDummyUpdate] = useState(0)
  const [isInputDisabled, setIsInputDisabled] = useState(false)
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PLAYING)
  const isGameOver = gameStatus !== GameStatus.PLAYING

  const caretPosition = useRef(DEFAULT_POS)

  const updatePos = useCallback(() => {
    const pos = caretPosition.current
    const newPos = {
      r: pos.r,
      c: pos.c + 1,
    }
    caretPosition.current = newPos
  }, [caretPosition])

  const handleLetterInput = useCallback(
    (e: { key: string }) => {
      playSound("click")
      if (!e.key.match(VALID_CHARS_REGEX)) return
      const { r, c } = caretPosition.current
      if (c > 4) return
      setGrid((prev) => {
        const newGrid = deepCopyGrid(prev)
        newGrid[r][c].char = e.key.toUpperCase()
        return newGrid
      })
      updatePos()
    },
    [caretPosition, playSound, setGrid, updatePos]
  )

  const handleBackspace = useCallback(() => {
    playSound("click")
    const { r, c } = caretPosition.current
    if (c == 0) return
    const newGrid = deepCopyGrid(grid)
    newGrid[r][c - 1].char = ""
    setGrid(newGrid)
    caretPosition.current.c -= 1
  }, [grid, playSound])

  const revealResults = useCallback(
    async (accuracies: number[], row: number) => {
      let totalAccuracy = 0
      setIsInputDisabled(true)
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
          vibrate(VIBRATIONS.revealLetter)
          setTimeout(resolve, 400)
        })
      }
      setIsInputDisabled(false)
      if (totalAccuracy === 10) {
        setGameStatus(GameStatus.WON)
        playSound("success")
        vibrate(VIBRATIONS.win)
        return
      }
      if (row === grid.length - 1) {
        vibrate(VIBRATIONS.lose)
        return setGameStatus(GameStatus.LOST)
      }

      caretPosition.current = {
        r: caretPosition.current.r + 1,
        c: 0,
      }
      setDummyUpdate(dummyUpdate + 1)
    },
    [dummyUpdate, grid, playSound]
  )

  const compareWord = useCallback(async () => {
    const { r, c } = caretPosition.current
    if (c <= 4) return
    const input = grid[r].map(({ char }) => char)
    const isValid = await isValidWord(input.join(""))
    if (!isValid) {
      toast({
        title: "Word is not in the dictionary!",
        variant: "destructive",
        duration: 3000,
      })
      vibrate(VIBRATIONS.invalidWord)
      playSound("error")
      setIsInputDisabled(true)

      gridRefs.current.rows[r]!.animate(ANIMATIONS.shake, {
        duration: 100,
        iterations: 3,
      })
      return setTimeout(() => setIsInputDisabled(false), 300)
    }
    const accuracies = getAccuracyArray(answer.current, input)
    revealResults(accuracies, r)
  }, [grid, playSound, revealResults, toast])

  const handleKeyDown = useCallback(
    (e: { key: string }) => {
      if (isGameOver) return
      if (isInputDisabled) return

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
    },
    [
      compareWord,
      handleBackspace,
      handleLetterInput,
      isGameOver,
      isInputDisabled,
    ]
  )

  const restart = async () => {
    keysStatus.current = {}
    caretPosition.current = DEFAULT_POS
    answer.current = await getSolution(gameMode)
    setGrid(DEFAULT_GRID)
    setGameStatus(GameStatus.PLAYING)
  }
  useEffect(() => {
    getSolution(gameMode).then((ans) => (answer.current = ans))
  }, [gameMode])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [grid, caretPosition, gameStatus, handleKeyDown])

  return {
    grid,
    gridRefs,
    isInputDisabled,
    gameStatus,
    restart,
    handleKeyInput: handleKeyDown,
    isGameOver,
    answer: answer.current,
    caretPosition: caretPosition.current,
    keysStatus: keysStatus.current,
    rerenderDummyState: dummyUpdate,
  }
}
