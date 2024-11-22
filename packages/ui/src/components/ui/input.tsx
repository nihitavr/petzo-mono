import * as React from "react";

import { cn } from "@petzo/ui/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:h-12 md:focus:text-sm",
          className,
        )}
        ref={ref}
        {...props}
        onWheel={(e) => (e.target as HTMLInputElement).blur()}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
