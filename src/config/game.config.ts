export const DEFAULT_POS = { r: 0, c: 0 }
export const VALID_CHARS_REGEX = /^[a-zA-Z]$/
export const KEYS = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "Enter.Z.X.C.V.B.N.M.Backspace".split("."),
]

export enum Accuracy {
  CORRECT = 2,
  PARTIAL = 1,
  INCORRECT = 0,
  UNKNOWN = -1,
}
export enum GameStatus {
  PLAYING = "playing",
  WON = "won",
  LOST = "lost",
}

export type GridViewRef = {
  rows: (HTMLDivElement | null)[]
  items: Record<string, HTMLParagraphElement | null>
}

export const DEFAULT_GRID_REFS: GridViewRef = {
  rows: [],
  items: {},
}

export const GRID_ROWS = 6

export type Grid = {
  accuracy: Accuracy
  char: string
}[][]
export const DEFAULT_GRID: Grid = Array(GRID_ROWS).fill(
  Array(5).fill({
    accuracy: Accuracy.UNKNOWN,
    value: "",
  })
)

export const COLORS = {
  [Accuracy.CORRECT]:
    "bg-emerald-500 outline-emerald-500 outline-emerald-600 border-emerald-600",
  [Accuracy.PARTIAL]:
    "bg-amber-500 outline-amber-500 outline-amber-600 border-amber-600",
  [Accuracy.INCORRECT]: "text-muted-foreground",
  [Accuracy.UNKNOWN]: "text-foreground",
}
