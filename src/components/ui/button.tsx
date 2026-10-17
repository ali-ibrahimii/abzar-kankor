import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Site-wide button styles live here so pages stay short.
 * Variants: primary (brand violet), mint (hero CTA), dark (nav CTA),
 * secondary (outline card), ghost, glass (on dark panels), link.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25",
        mint: "bg-[#b7f486] text-[#17233a] shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:bg-[#c7f89c]",
        dark: "bg-[#17233a] text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-primary",
        secondary:
          "border border-border bg-card/70 text-foreground hover:border-primary/30 hover:bg-primary/5",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        glass:
          "border border-white/15 bg-white/[0.06] text-white hover:border-white/30 hover:bg-white/10",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-9 px-3.5 text-xs",
        default: "min-h-11 px-5",
        lg: "min-h-13 px-6",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "primary"}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
