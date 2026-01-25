import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl gradient-text",
      h2: "scroll-m-20 border-b border-gray-200 dark:border-slate-700 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-4 border-primary-500 pl-6 italic",
      ul: "my-6 ml-6 list-disc [&>li]:mt-2",
      code: "relative rounded bg-gray-100 dark:bg-slate-800 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-gray-600 dark:text-gray-400",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-gray-500 dark:text-gray-400",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

function Typography({
  className,
  variant,
  as,
  ...props
}: TypographyProps) {
  const Comp = as || (variant === "h1" ? "h1" : variant === "h2" ? "h2" : variant === "h3" ? "h3" : variant === "h4" ? "h4" : variant === "blockquote" ? "blockquote" : variant === "code" ? "code" : variant === "ul" ? "ul" : "p")
  
  return (
    <Comp className={cn(typographyVariants({ variant }), className)} {...props} />
  )
}

export { Typography, typographyVariants }
