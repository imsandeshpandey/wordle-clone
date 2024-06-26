import { FC } from "react"
import { cn } from "../lib/utils"
import { Accuracy, KEYS, COLORS } from "../config/game.config"
import { Delete } from "lucide-react"

type KeyboardProps = {
  keysStatus: Record<string, Accuracy>
  onKeyInput: (e: { key: string }) => void
}
export const KeyboardView: FC<KeyboardProps> = ({ keysStatus, onKeyInput }) => {
  const handleKeyInput = (e: React.MouseEvent<HTMLDivElement>) => {
    //@ts-expect-error closest doensn't exist on type HTMLDivElement
    const key = e.target.closest("[data-key]")?.dataset.key
    if (!key) return
    onKeyInput({ key })
  }
  return (
    <div onClick={handleKeyInput} className="mt-8 flex flex-col gap-1">
      {KEYS.map((row) => (
        <div className="mx-auto flex w-fit gap-1">
          {row.map((key) => (
            <Key key={key} val={key} status={keysStatus[key]} />
          ))}
        </div>
      ))}
    </div>
  )
}
const Key = ({ val, status }: { val: string; status: Accuracy }) => {
  const explicitStyles = {
    "w-20": val === "Enter",
    "w-16": val === "Backspace",
  }
  return (
    <div className={cn("relative h-14 min-w-12", explicitStyles)}>
      <button
        data-key={val}
        className={cn(
          "absolute flex h-14 w-12 origin-bottom cursor-pointer items-center justify-center rounded-md border-2 border-border bg-muted/20 px-4 text-lg font-medium shadow-sm transition-all hover:scale-105 active:mt-0.5 active:scale-90",
          explicitStyles,
          COLORS[status],
          status === Accuracy.INCORRECT && "bg-rose-600 text-foreground"
        )}
      >
        {val === "Backspace" ? <Delete className="h-5 w-5" /> : val}
      </button>
    </div>
  )
}
