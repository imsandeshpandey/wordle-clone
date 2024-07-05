import { Accuracy, GameMode, Grid } from "@/config/game.config"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const deepCopyGrid = (grid: Grid) => {
  return grid.map((row) => row.map((item) => ({ ...item })))
}

export const getRandomWordle = async () => {
  const answers = await import("@/config/answers.config").then(
    (module) => module.default
  )
  const idx = Math.floor(Math.random() * answers.length)
  return answers[idx].toUpperCase()
}

export const getWordFrequencyMap = (word: string) => {
  const wordFrequencyMap = {} as Record<string, number>
  for (const char of word) {
    wordFrequencyMap[char] = (wordFrequencyMap[char] || 0) + 1
  }
  return wordFrequencyMap
}

export const vibrate = (...args: Parameters<typeof navigator.vibrate>) => {
  if ("vibrate" in navigator) {
    navigator.vibrate(...args)
  }
}

export const getAccuracyArray = (expectedWord: string, userInput: string[]) => {
  const frequencyMap = getWordFrequencyMap(expectedWord)
  const accuracies: Accuracy[] = []

  for (const idx in userInput) {
    const char = userInput[idx]
    if (!frequencyMap[char]) {
      accuracies.push(Accuracy.INCORRECT)
      continue
    }
    const expectedChar = expectedWord[idx]
    const accuracy = expectedChar == char ? Accuracy.CORRECT : Accuracy.PARTIAL

    accuracies.push(accuracy)
    frequencyMap[char]--
  }
  return accuracies
}

export const getTodaysWordle = async () => {
  try {
    const response = await fetch("/api/wordle")
    const data = await response.json()
    if (!data.solution) return getRandomWordle()
    return data.solution.toUpperCase()
  } catch (err) {
    console.error(err)
    return getRandomWordle()
  }
}

export const isValidWord = async (word: string) => {
  const words = await import("@/config/words.config").then((mod) => mod.default)
  return word.toLowerCase() in words
}

export const getSolution = async (gameMode: GameMode) => {
  switch (gameMode) {
    case GameMode.TODAY:
      return await getTodaysWordle()
    case GameMode.RANDOM:
      return getRandomWordle()
    default:
      return "invalid"
  }
}
