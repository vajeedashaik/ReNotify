import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-white shadow-md hover:shadow-glow hover:scale-105",
        secondary:
          "border-transparent bg-accent-500 text-white shadow-md hover:shadow-glow-accent hover:scale-105",
        destructive:
          "border-transparent bg-status-expired text-white shadow-md hover:shadow-lg hover:scale-105",
        outline:
          "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:scale-105",
        success:
          "border-transparent bg-status-active text-white shadow-md hover:shadow-glow hover:scale-105",
        warning:
          "border-transparent bg-status-expiring text-white shadow-md hover:shadow-lg hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
