"use client";

import {
  type HTMLAttributes,
  useEffect,
  useEffectEvent,
  useState
} from "react";

import { cn } from "@rzl-zone/docs-ui/utils";
import { X } from "@rzl-zone/docs-ui/components/icons/lucide";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";

type BannerVariant = "rainbow" | "normal";

export function Banner({
  id,
  variant = "normal",
  changeLayout = true,
  height = "2.5rem",
  rainbowColors = [
    "rgb(0, 149, 255)",
    "rgb(248, 153, 19)",
    "rgb(255, 187, 0)",
    "rgb(255, 0, 0)"
    // "rgba(0,149,255,0.56)",
    // "rgba(231,77,255,0.77)",
    // "rgba(255,0,0,0.73)",
    // "rgba(131,255,166,0.66)"
  ],
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  /**
   * @default 2.5rem
   */
  height?: string;

  /**
   * @default 'normal'
   */
  variant?: BannerVariant;

  /**
   * For rainbow variant only, customize the colors
   *
   * @default
   * [
   *   "rgb(0, 149, 255)",
   *   "rgb(248, 153, 19)",
   *   "rgb(255, 187, 0)",
   *   "rgb(255, 0, 0)"
   * ]
   */
  rainbowColors?: string[];

  /**
   * Change Fumadocs layout styles
   *
   * @default true
   */
  changeLayout?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const globalKey = id ? `nd-banner-${id}` : null;

  const changeSetOpen = useEffectEvent((valueOpen: boolean) =>
    setOpen(valueOpen)
  );

  useEffect(() => {
    if (globalKey) changeSetOpen(localStorage.getItem(globalKey) !== "true");
  }, [globalKey]);

  if (!open) return null;

  return (
    <div
      id={id}
      {...props}
      className={cn(
        "sticky top-0 z-40 flex flex-row items-center justify-center px-4 text-center text-sm font-medium text-neutral-800 dark:text-slate-300 text-shadow-md/20",
        variant === "normal" && "bg-fd-secondary",
        variant === "rainbow" &&
          "bg-fd-primary/50 dark:bg-fd-secondary/75 backdrop-blur-sm",
        !open && "hidden",
        props.className
      )}
      style={{
        height
      }}
    >
      {changeLayout && open ? (
        <style>
          {globalKey
            ? `:root:not(.${globalKey}) { --fd-banner-height: ${height}; }`
            : `:root { --fd-banner-height: ${height}; }`}
        </style>
      ) : null}
      {globalKey ? (
        <style>{`.${globalKey} #${id} { display: none; }`}</style>
      ) : null}
      {globalKey ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `if (localStorage.getItem('${globalKey}') === 'true') document.documentElement.classList.add('${globalKey}');`
          }}
        />
      ) : null}

      {variant === "rainbow"
        ? flow({
            colors: rainbowColors
          })
        : null}
      {props.children}
      {id ? (
        <button
          type="button"
          aria-label="Close Banner"
          onClick={() => {
            setOpen(false);
            if (globalKey) localStorage.setItem(globalKey, "true");
          }}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className:
                "absolute end-2 top-1/2 -translate-y-1/2 text-fd-muted-foreground/50",
              size: "icon-sm"
            })
          )}
        >
          <X />
        </button>
      ) : null}
    </div>
  );
}

const maskImage =
  "linear-gradient(to bottom,red,transparent), radial-gradient(circle at top center, #f90c00,transparent)";

function flow({ colors }: { colors: string[] }) {
  return (
    <>
      <div
        className="absolute inset-0 z-[-1]"
        style={
          {
            maskImage,
            maskComposite: "intersect",
            animation: "fd-moving-banner 5s linear infinite",
            backgroundImage: `repeating-linear-gradient(70deg, ${[
              ...colors,
              colors[0]
            ]
              .map((color, i) => `${color} ${(i * 50) / colors.length}%`)
              .join(", ")})`,
            // backdropFilter: "blur(124px)",
            // WebkitBackdropFilter: "blur(124px)",
            // opacity: 0.7,
            // filter: "blur(24px) saturate(1)",
            backgroundSize: "200% 100%"
          } as object
        }
      />
      <style>
        {`@keyframes fd-moving-banner {
            from { background-position: 0% 0;  }
            to { background-position: 100% 0;  }
        }`}
      </style>
    </>
  );
}
