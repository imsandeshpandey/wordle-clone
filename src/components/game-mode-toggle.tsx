import { Button } from "./ui/button"
import { CalendarDays, Dices } from "lucide-react"
import { GameMode } from "../config/game.config"
import { ComponentProps, FC } from "react"
import { cn } from "@/lib/utils"

const uiDataMap = {
  [GameMode.TODAY]: {
    Icon: CalendarDays,
    label: "Today",
    pathname: "/random",
  },
  [GameMode.RANDOM]: {
    Icon: Dices,
    label: "Random",
    pathname: "/",
  },
}
type GameModeToggleProps = ComponentProps<typeof Button> & {
  gameMode: GameMode
}

export const GameModeToggle: FC<GameModeToggleProps> = ({
  gameMode,
  className,
  ...props
}) => {
  if (gameMode === GameMode.INVALID) return null

  const { Icon, label, pathname } = uiDataMap[gameMode]

  return (
    <Button
      variant="ghost"
      asChild
      className={cn("gap-1 px-1 text-xs md:gap-2 md:text-sm", className)}
      {...props}
    >
      <a rel="noreferrer" href={`${window.location.origin}${pathname}`}>
        <Icon className="rotate-in-90 h-3.5 w-3.5 animate-in md:h-4 md:w-4" />
        {label}
      </a>
    </Button>
  )
}
