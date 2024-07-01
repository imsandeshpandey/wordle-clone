import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers/theme.provider"
import { ComponentProps, FC } from "react"
import { cn } from "@/lib/utils"

export type ModeToggleProps = ComponentProps<typeof Button>

export const ModeToggle: FC<ModeToggleProps> = ({ className, ...props }) => {
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")
  const Icon = theme === "light" ? Sun : Moon
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className={cn(
        "hover:bg-initial active:bg-initial h-fit gap-1 rounded-full bg-transparent px-1 text-xs md:gap-2 md:text-sm",
        className
      )}
      {...props}
    >
      <Icon className="rotate-in-90 h-3.5 w-3.5 animate-in md:h-4 md:w-4" />
      <span className="sr-only">Toggle theme</span>
      <p className="capitalize-first">{theme}</p>
    </Button>
  )
}
