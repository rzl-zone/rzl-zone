import { cn, cva } from "@/utils";

const variant = {
  default: cn("bg-primary text-primary-foreground hover:bg-primary/90", ""),
  destructive: cn(
    "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  ),
  outline: cn(
    "border bg-fd-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
    // "border hover:bg-accent hover:text-accent-foreground"
    // "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    // "disabled:bg-background aria-disabled:bg-background",
  ),
  success: cn(
    "shadow-black",
    "bg-green-500 hover:bg-green-600 focus:bg-green-700 focus:hover:bg-green-600",
    "text-white hover:text-white focus:text-white focus:hover:text-neutral-50",
    "dark:bg-green-500 dark:hover:bg-green-600 dark:focus:bg-green-700 dark:focus:hover:bg-green-700/70",
    "dark:text-white dark:hover:text-white dark:focus:text-white dark:focus:hover:text-white",
    "disabled:hover:no-underline",
    "disabled:text-slate-300 disabled:dark:text-neutral-100",
    "disabled:bg-green-700 disabled:dark:bg-green-600",
    "disabled:hover:bg-green-700 disabled:dark:hover:bg-green-600",
    "aria-disabled:hover:no-underline",
    "aria-disabled:text-slate-300 aria-disabled:dark:text-neutral-100",
    "aria-disabled:bg-green-700 aria-disabled:dark:bg-green-600",
    "aria-disabled:hover:bg-green-700 aria-disabled:dark:hover:bg-green-600"
  ),
  info: cn(
    "shadow-black",
    "bg-sky-500 hover:bg-sky-600 focus:bg-sky-700/90 focus:hover:bg-sky-600/90",
    "text-white hover:text-white focus:text-white focus:hover:text-white",
    "dark:bg-sky-600 dark:hover:bg-sky-600/80 dark:focus:bg-sky-600/70 dark:focus:hover:bg-sky-600/90",
    "dark:text-white dark:hover:text-white dark:focus:text-white dark:focus:hover:text-neutral-50",
    "disabled:hover:no-underline",
    "disabled:text-neutral-300 disabled:dark:text-neutral-100",
    "disabled:bg-sky-700 disabled:dark:bg-sky-600",
    "disabled:hover:bg-sky-700 disabled:dark:hover:bg-sky-600",
    "aria-disabled:hover:no-underline",
    "aria-disabled:text-neutral-300 aria-disabled:dark:text-neutral-100",
    "aria-disabled:bg-sky-700 aria-disabled:dark:bg-sky-600",
    "aria-disabled:hover:bg-sky-700 aria-disabled:dark:hover:bg-sky-600"
  ),
  danger: cn(
    "shadow-black",
    "bg-red-600 hover:bg-red-700 focus:bg-red-800/90 focus:hover:bg-red-700/90",
    "text-white hover:text-white focus:text-white focus:hover:text-white",
    "dark:bg-red-600 dark:hover:bg-red-600/80 dark:focus:bg-red-600/60 dark:focus:hover:bg-red-600/80",
    "dark:text-white dark:hover:text-white dark:focus:text-white dark:focus:hover:text-neutral-200",
    "disabled:hover:no-underline",
    "disabled:text-neutral-300 disabled:dark:text-neutral-200",
    "disabled:bg-red-800 disabled:dark:bg-red-700",
    "disabled:hover:bg-red-800 disabled:dark:hover:bg-red-700",
    "aria-disabled:hover:no-underline",
    "aria-disabled:text-neutral-300 aria-disabled:dark:text-neutral-200",
    "aria-disabled:bg-red-800 aria-disabled:dark:bg-red-700",
    "aria-disabled:hover:bg-red-800 aria-disabled:dark:hover:bg-red-700"
  ),
  warning: cn(
    "shadow-black",
    "text-white hover:text-white focus:text-white focus:hover:text-neutral-50",
    "dark:text-slate-200 dark:hover:text-slate-100 dark:focus:text-white dark:focus:hover:text-neutral-50",
    "bg-orange-500 hover:bg-orange-600 focus:bg-orange-700/90 focus:hover:bg-orange-600",
    "dark:bg-orange-600 dark:hover:bg-orange-600/85 dark:focus:bg-orange-600/70 dark:focus:hover:bg-orange-600/90",
    // "text-shadow-md dark:shadow-slate-950",
    "disabled:hover:no-underline",
    "disabled:text-neutral-300 disabled:dark:text-neutral-200",
    "disabled:bg-yellow-700 disabled:dark:bg-orange-800",
    "disabled:hover:bg-yellow-700 disabled:dark:hover:bg-orange-800",
    "aria-disabled:hover:no-underline",
    "aria-disabled:text-neutral-300 aria-disabled:dark:text-neutral-200",
    "aria-disabled:bg-yellow-700 aria-disabled:dark:bg-orange-800",
    "aria-disabled:hover:bg-yellow-700 aria-disabled:dark:hover:bg-orange-800"
  ),
  secondaryDark: cn(
    "shadow-black",
    "bg-gray-500 hover:bg-gray-600 focus:bg-gray-700/80 focus:hover:bg-gray-600/75",
    "text-neutral-100 hover:text-neutral-50 focus:text-white",
    "dark:bg-gray-600 dark:hover:bg-gray-600/75 dark:focus:bg-gray-600/65 dark:focus:hover:bg-gray-600/90",
    "dark:text-neutral-50 dark:hover:text-slate-100 dark:focus:text-white",
    "disabled:hover:no-underline",
    "disabled:text-neutral-200 dark:disabled:text-neutral-100",
    "disabled:bg-neutral-500 dark:disabled:bg-neutral-700/70",
    "disabled:hover:bg-neutral-500 dark:disabled:hover:bg-neutral-700/70",
    "aria-disabled:text-neutral-200 dark:aria-disabled:text-neutral-100",
    "aria-disabled:bg-neutral-500 dark:aria-disabled:bg-neutral-700/70",
    "aria-disabled:hover:bg-neutral-500 dark:aria-disabled:hover:bg-neutral-700/70"
    // "disabled:bg-neutral-500 disabled:text-neutral-200 dark:disabled:bg-neutral-700/70 dark:disabled:text-neutral-100",
    // "aria-disabled:bg-neutral-500 aria-disabled:text-neutral-200 dark:aria-disabled:bg-neutral-700/70 dark:aria-disabled:text-neutral-100"
  ),
  secondary: cn(
    "shadow-black",
    "bg-gray-400 hover:bg-gray-500/85 focus:bg-gray-500/95 focus:hover:bg-gray-500/80",
    "text-neutral-100 hover:text-neutral-100 focus:text-neutral-50 focus:hover:text-neutral-50",
    "dark:bg-gray-500 dark:hover:bg-gray-500/75 dark:focus:bg-gray-500/65 dark:focus:hover:bg-gray-500/90",
    "dark:text-neutral-50 dark:hover:text-slate-100 dark:focus:text-white dark:focus:hover:text-white",
    "disabled:hover:no-underline",
    "aria-disabled:hover:no-underline",
    "disabled:text-neutral-100 dark:disabled:text-neutral-50",
    "disabled:bg-gray-500/60 dark:disabled:bg-gray-500",
    "disabled:hover:bg-gray-500/60 dark:disabled:hover:bg-gray-500",
    "aria-disabled:text-neutral-100 dark:aria-disabled:text-neutral-50",
    "aria-disabled:bg-gray-500/60 dark:aria-disabled:bg-gray-500",
    "aria-disabled:hover:bg-gray-500/60 dark:aria-disabled:hover:bg-gray-500"
  ),
  ghost: cn(
    // "hover:bg-accent hover:text-accent-foreground"
    // "hover:bg-accent hover:text-accent-foreground",
    "hover:bg-fd-accent hover:text-fd-accent-foreground"
  ),
  link: cn(
    "bg-transparent dark:bg-transparent",
    "h-auto x2s:h-auto x1sP1:h-auto",
    "underline-offset-2 hover:underline",
    "shadow-neutral-600 px-0",
    "text-slate-700 hover:text-neutral-800 focus:hover:text-neutral-950",
    "dark:text-neutral-50 dark:hover:text-slate-300 dark:focus:hover:text-white"
  ),
  linkBlue: cn(
    // "bg-transparent dark:bg-transparent",
    "h-auto x2s:h-auto x1sP1:h-auto",
    "underline-offset-2 px-0 hover:underline",
    "shadow-blue-600 dark:shadow-black",
    "text-blue-800 hover:text-blue-950 focus:hover:text-black",
    "dark:text-blue-500 dark:hover:text-blue-400 dark:focus:hover:text-blue-300",
    "disabled:hover:no-underline",
    "disabled:text-blue-800 disabled:hover:text-blue-800",
    "disabled:hover:dark:text-blue-500",
    "aria-disabled:hover:no-underline",
    "aria-disabled:text-blue-800 aria-disabled:hover:text-blue-800",
    "aria-disabled:hover:dark:text-blue-500"
  ),
  linkOrange: cn(
    "bg-transparent dark:bg-transparent",
    "h-auto x2s:h-auto x1sP1:h-auto",
    "underline-offset-2 px-0 hover:underline",
    "shadow-orange-400 dark:shadow-black",
    "text-orange-600 hover:text-orange-700 focus:hover:text-orange-800",
    "dark:text-orange-500 dark:hover:text-orange-400 dark:focus:hover:text-orange-300",
    "disabled:hover:no-underline",
    "disabled:text-orange-800 disabled:hover:text-orange-800",
    "disabled:hover:dark:text-orange-500",
    "aria-disabled:hover:no-underline",
    "aria-disabled:text-orange-800 aria-disabled:hover:text-orange-800",
    "aria-disabled:hover:dark:text-orange-500"
  ),
  linkGreen: cn(
    "bg-transparent dark:bg-transparent",
    "h-auto x2s:h-auto x1sP1:h-auto",
    "underline-offset-2 px-0 hover:underline",
    "shadow-green-500 dark:shadow-black",
    "text-green-700 hover:text-green-800 focus:hover:text-green-900",
    "dark:text-green-500 dark:hover:text-green-400 dark:focus:hover:text-green-300",
    "disabled:hover:no-underline",
    "disabled:text-green-900 disabled:hover:text-green-900",
    "disabled:hover:dark:text-green-500",
    "aria-disabled:hover:no-underline",
    "aria-disabled:text-green-900 aria-disabled:hover:text-green-900",
    "aria-disabled:hover:dark:text-green-500"
  )
};

/** ------------------------------------
 * * Styles of Button Components UI
 * ------------------------------------
 *
 * @description Styling Customs of Button Component ShadCN.
 *
 */
export const buttonVariants = cva(
  cn(
    "font-semibold",
    "inline-flex",
    "flex items-center justify-center rounded-md",
    // "text-sm",
    "focus-visible:outline-none",
    "tracking-[0.031rem]",
    "transition-colors",
    "duration-300 ease-in-out",
    "text-shadow-sm",
    "disabled:opacity-85 disabled:hover:cursor-not-allowed",
    "shadow-neutral-900",
    "aria-disabled:opacity-85 aria-disabled:hover:cursor-not-allowed"
  ),
  {
    variants: {
      size: {
        xxs: cn(
          "text-x5s",
          "px-1 py-0.5"
          // "h-4",
          // "px-1.5",
        ),
        xs2: cn(
          // "h-[1.063rem]",
          "px-1.25 py-0.75",
          "text-x4s"
        ),
        xs: cn(
          // "h-[1.188rem]",
          "px-1.5 py-1",
          "text-x3s"
        ),
        sm: cn(
          // "h-5.5",
          // "px-3",
          "px-2 py-1",
          "text-x2s"
        ),
        default: cn(
          // "h-[1.438rem]",
          // "px-4",
          "px-2.5 py-1.5",
          "text-xs"
        ),
        medium: cn(
          "px-2.5 py-1.25"
          // "h-[1.563rem]",
          // "px-6"
        ),
        lg: cn("px-3 py-2"),
        // "h-[1.688rem]",
        // "px-8"
        xl: cn("px-3.5 py-2.5"),
        // "h-[1.813rem]",
        // "px-8"
        defaultWithIcon: cn(
          "h-[1.563rem] px-4 text-sm",
          "flex items-center justify-center gap-0.5 px-2"
        ),
        icon: cn("rounded-md [&_svg]:size-5"),
        "icon-sm": cn("p-1.5 [&_svg]:size-4.5"),
        "icon-xs": cn("p-1 [&_svg]:size-4"),
        "icon-xxs": cn("p-0.75 [&_svg]:size-3.5")
      },
      variant: variant,
      // color: variant,
      /**
       * @default "md"
       * @description rounding of field
       */
      rounded: {
        none: cn("rounded-none"),
        sm: cn("rounded-sm"),
        md: cn("rounded-md"),
        lg: cn("rounded-lg"),
        xl: cn("rounded-xl"),
        "2xl": cn("rounded-2xl"),
        "3xl": cn("rounded-3xl"),
        full: cn("rounded-full")
      }
    },
    defaultVariants: {
      variant: "default",
      rounded: "md",
      // color: "default",
      size: "default"
    }
  }
);

/** ------------------------------------
 * * Styles of Input Components UI
 * ------------------------------------
 *
 * @description Styling Customs of Input Component ShadCN.
 *
 */
export const inputFieldVariants = cva(
  cn(
    "font-semibold",
    "shadow-2xl drop-shadow-2xl",
    "flex w-full placeholder:text-muted-foreground",
    "bg-slate-100 dark:bg-slate-700",
    "disabled:cursor-not-allowed disabled:opacity-75",
    "file:border-0 file:text-sm file:font-medium file:bg-transparent file:cursor-pointer",
    "file:focus:border-blue-600",
    "border-1.5",
    "transition duration-300",
    "inner-border-0",
    "rounded-2xl"
  ),
  {
    variants: {
      /**
       * @default "default"
       * @description sizing of field
       */
      sizeField: {
        x2s: cn(
          "h-[1.3rem] max-h-[1.3rem] px-1.5 py-1.25 text-x2s xxs:text-x2s xsP:text-x2s"
        ),
        xs: cn("h-7 max-h-7 px-2 py-1.5 text-xs xxs:text-xs xsP:text-xs"),
        sm: cn("h-8 max-h-8 px-2.5 py-1.5 text-xs"),
        default: cn("h-10 max-h-10 px-3 py-2 text-sm")
      },
      /**
       * @default "lg"
       * @description rounding of field
       */
      rounded: {
        none: cn("rounded-none"),
        sm: cn("rounded-sm"),
        md: cn("rounded-md"),
        lg: cn("rounded-lg"),
        xl: cn("rounded-xl"),
        "2xl": cn("rounded-2xl"),
        "3xl": cn("rounded-3xl"),
        full: cn("rounded-full")
      }
    },
    defaultVariants: {
      sizeField: "default",
      rounded: "lg"
    }
  }
);
