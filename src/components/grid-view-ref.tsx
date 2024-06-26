import { Accuracy, COLORS, Grid, GridViewRef } from "@/config/game.config"
import { cn } from "@/lib/utils"
import { FC, useEffect, useState } from "react"

export type GridViewProps = {
  grid: Grid
  pos: [number, number]
  refs: React.MutableRefObject<GridViewRef>
  update: number
  isRevealing: boolean
}
export const GridView: FC<GridViewProps> = ({
  grid,
  pos,
  refs,
  update,
  isRevealing,
}) => {
  const [caretPos, setCaretPos] = useState<(string | number)[]>([])

  useEffect(() => {
    const currRow = refs.current.rows[pos[0]]
    const currItem = refs.current.items[`${pos[0]}-${pos[1]}`]
    if (!currRow || !currItem) return
    setCaretPos([currRow.offsetTop, currItem.offsetLeft])
  }, [pos, refs, update])

  return (
    <div className="relative flex flex-col gap-2 text-3xl font-bold uppercase">
      <div
        style={{ top: caretPos[0], left: caretPos[1] }}
        className={cn(
          "absolute aspect-square h-[4.25rem] rounded-md border-2 border-foreground transition-all",
          isRevealing && "opacity-0"
        )}
      />
      {grid.map((row, rowIdx) => (
        <div
          ref={(el) => (refs.current.rows[rowIdx] = el)}
          id={`row-${rowIdx}`}
          key={rowIdx}
          className="flex gap-2"
        >
          {row.map(({ char, accuracy }, charIdx) => (
            <p
              ref={(el) => (refs.current.items[`${rowIdx}-${charIdx}`] = el)}
              id={`${rowIdx}-${charIdx}`}
              key={charIdx}
              style={{ transitionDelay: "0.3s" }}
              className={cn(
                "flex aspect-square h-[4.25rem] items-center justify-center rounded-lg border-2 bg-foreground/5 shadow-sm transition-all",
                COLORS[accuracy],
                !!char &&
                  accuracy == Accuracy.UNKNOWN &&
                  "animate-in zoom-in-50",
                accuracy !== Accuracy.UNKNOWN && "animate-flip"
              )}
            >
              {char}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
