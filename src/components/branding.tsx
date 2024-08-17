import { FC, HTMLAttributes } from "react"
import { cn } from "../lib/utils.ts"

type BrandingProps = HTMLAttributes<HTMLDivElement>
export const Branding: FC<BrandingProps> = ({ className, ...props }) => {
  return (
    <h1
      className={cn(
        "flex-items-center relative pb-3 text-2xl font-bold drop-shadow-md md:text-4xl",
        className
      )}
      {...props}
    >
      Wordle
    </h1>
  )
}
