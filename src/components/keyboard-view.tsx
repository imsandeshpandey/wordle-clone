import { FC, useEffect, useRef } from "react"
import { cn, vibrate } from "../lib/utils"
import { Accuracy, KEYS, COLORS } from "../config/game.config"
import { Delete } from "lucide-react"
import { ANIMATIONS } from "@/config/animations.config"
import { VIBRATIONS } from "@/config/vibrations.config"

type KeyboardProps = {
  keysStatus: Record<string, Accuracy>
  onKeyInput: (e: { key: string }) => void
}
type KeyRefs = Record<string, HTMLButtonElement>
export const KeyboardView: FC<KeyboardProps> = ({ keysStatus, onKeyInput }) => {
  const keyRefs = useRef<KeyRefs>({})

  const handleKeyInput = (e: React.MouseEvent<HTMLDivElement>) => {
    //@ts-expect-error closest doensn't exist on type HTMLDivElement
    const key = e.target.closest("[data-key]")?.dataset.key
    if (!key) return
    onKeyInput({ key })
  }
  const handleVibrate = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    //@ts-expect-error closest doensn't exist on type HTMLDivElement
    const key = e.target.closest("[data-key]")?.dataset.key
    if (!key) return
    vibrate(VIBRATIONS.keyDown)
  }

  const animateKey = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase()
    const keyRef = keyRefs.current[key]
    if (!keyRef) return
    keyRef.animate(ANIMATIONS.buttonPress, {
      duration: 100,
      easing: "ease-in-out",
    })
  }
  useEffect(() => {
    document.addEventListener("keydown", animateKey)
    return () => {
      document.removeEventListener("keydown", animateKey)
    }
  }, [])
  return (
    <div
      onTouchStart={handleVibrate}
      onClick={handleKeyInput}
      className="mt-8 flex select-none flex-col gap-1"
    >
      {KEYS.map((row) => (
        <div className="mx-auto flex w-fit gap-1">
          {row.map((key) => (
            <Key
              keyRefs={keyRefs.current}
              key={key}
              val={key}
              status={keysStatus[key]}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
const Key = ({
  val,
  status,
  keyRefs,
}: {
  val: string
  status: Accuracy
  keyRefs: KeyRefs
}) => {
  const explicitStyles = {
    "w-14 md:min-w-20": val === "Enter",
    "w-10 md:w-16": val === "Backspace",
  }
  const keyLabel =
    val === "Backspace" ? <Delete className="h-3 w-3 md:h-5 md:w-5" /> : val

  return (
    <div className={cn("relative h-10 w-8 md:h-14 md:w-12", explicitStyles)}>
      <button
        ref={(el) => {
          if (el) keyRefs[val.toUpperCase()] = el
        }}
        data-key={val}
        className={cn(
          "absolute flex h-full w-full origin-bottom cursor-pointer items-center justify-center rounded-md border-2 border-border bg-muted/20 text-sm font-medium shadow-sm transition-all hover:scale-105 active:mt-0.5 active:scale-90 md:h-14 md:w-12 md:text-lg",
          explicitStyles,
          COLORS[status],
          status === Accuracy.INCORRECT &&
            "border-rose-700 bg-rose-600 text-background dark:text-foreground"
        )}
      >
        {keyLabel}
      </button>
    </div>
  )
}
