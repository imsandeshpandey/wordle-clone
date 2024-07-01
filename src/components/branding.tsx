import { FC, HTMLAttributes } from "react"
import { cn } from "../lib/utils.ts"

type BrandingProps = HTMLAttributes<HTMLDivElement>
export const Branding: FC<BrandingProps> = ({ className, ...props }) => {
  return (
    <div className={cn("w-fit py-2", className)} {...props}>
      <h1 className="flex-items-center relative text-2xl font-bold drop-shadow-md md:text-4xl">
        Wordle
      </h1>

      <p className="float-right ml-auto text-[8px] font-bold text-muted-foreground md:text-xs">
        by frsty
      </p>
    </div>
  )
}
