import { Accuracy, COLORS, Grid, GridViewRef } from "@/config/game.config"
import { cn } from "@/lib/utils"
import { FC } from "react"

export type GridViewProps = {
  grid: Grid
  pos: [number, number]
  refs: React.MutableRefObject<GridViewRef>
  update: number
}
export const GridView: FC<GridViewProps> = ({ grid, refs }) => {
  return (
    <div className="relative flex flex-col gap-1 text-2xl font-bold uppercase md:gap-2 md:text-3xl">
      {grid.map((row, rowIdx) => (
        <div
          ref={(el) => (refs.current.rows[rowIdx] = el)}
          id={`row-${rowIdx}`}
          key={rowIdx}
          className="flex gap-1 md:gap-2"
        >
          {row.map(({ char, accuracy }, charIdx) => (
            <p
              ref={(el) => (refs.current.items[`${rowIdx}-${charIdx}`] = el)}
              id={`${rowIdx}-${charIdx}`}
              key={charIdx}
              className={cn(
                "flex aspect-square h-12 items-center justify-center rounded-lg border-2 bg-foreground/5 shadow-sm transition-all md:h-[4.25rem]",
                COLORS[accuracy],
                {
                  "border-foreground/20 animate-in zoom-in-50":
                    accuracy == Accuracy.UNKNOWN && !!char,
                  "animate-flip": accuracy !== Accuracy.UNKNOWN,
                }
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
