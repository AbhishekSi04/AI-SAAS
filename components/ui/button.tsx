import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "link"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "hero"
  | "outline-glow"
  | "cta";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  link: "underline text-primary hover:text-primary/80 bg-transparent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "border border-primary text-primary bg-transparent hover:bg-primary/10",
  ghost: "bg-transparent hover:bg-primary/10 text-primary",
  hero: "bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:from-primary/90 hover:to-accent/90",
  "outline-glow": "border border-primary/50 text-primary bg-transparent shadow-glow hover:bg-primary/10",
  cta: "bg-accent text-accent-foreground font-bold shadow-lg hover:bg-accent/90"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        variantClasses[variant],
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "lg" && "px-6 py-3 text-lg",
        size === "icon" && "h-9 w-9 p-0",
        size === "default" && "px-4 py-2 text-base",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
