import { Grid } from "@/config/game.config"
import { words } from "@/config/words.config"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const deepCopyGrid = (grid: Grid) => {
  return grid.map((row) => row.map((item) => ({ ...item })))
}
export const getRandomWord = () => {
  const idx = Math.floor(Math.random() * words.length)
  return words[idx].toUpperCase()
}
export const getWordFrequencyMap = (word: string) => {
  const wordFrequencyMap = new Map<string, number>()
  for (const char of word) {
    if (wordFrequencyMap.has(char)) {
      wordFrequencyMap.set(char, (wordFrequencyMap.get(char) || 0) + 1)
    } else {
      wordFrequencyMap.set(char, 1)
    }
  }
  return wordFrequencyMap
}
