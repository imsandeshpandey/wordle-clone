import { Accuracy, COLORS, Grid, GridViewRef } from "@/config/game.config"
import { cn } from "@/lib/utils"
import { FC } from "react"
import { OnBoarding } from "./onboarding"
import { Info } from "lucide-react"
import { Branding } from "./branding"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export type GridViewProps = {
  grid: Grid
  pos: [number, number]
  refs: React.MutableRefObject<GridViewRef>
  update: number
}
export const GridView: FC<GridViewProps> = ({ grid, refs }) => {
  return (
    <div className="flex flex-1 items-end">
      <div className="relative flex flex-1 flex-col gap-1 text-2xl font-bold md:gap-2 md:text-3xl">
        <OnBoarding
          trigger={
            <div className="absolute left-0 right-0 top-0 -translate-y-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="relative mx-auto flex w-fit items-start justify-center">
                    <Branding />
                    <Info className="absolute right-0 top-0 h-4 w-4 -translate-y-1/2 translate-x-full text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="font-normal">
                  How to Play?
                </TooltipContent>
              </Tooltip>
            </div>
          }
        />
        {grid.map((row, rowIdx) => (
          <div
            ref={(el) => (refs.current.rows[rowIdx] = el)}
            id={`row-${rowIdx}`}
            key={rowIdx}
            className="flex justify-center gap-1 uppercase md:gap-2"
          >
            {row.map(({ char, accuracy }, charIdx) => (
              <p
                ref={(el) => (refs.current.items[`${rowIdx}-${charIdx}`] = el)}
                id={`${rowIdx}-${charIdx}`}
                key={charIdx}
                className={cn(
                  "flex aspect-square max-h-[4.25rem] min-h-10 min-w-10 max-w-[4.25rem] flex-1 items-center justify-center rounded-lg border-2 bg-foreground/5 shadow-sm transition-all",
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
    </div>
  )
}
