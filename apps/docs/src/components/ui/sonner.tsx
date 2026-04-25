"use client";

import { useTheme } from "@rzl-zone/next-kit/themes";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  Toaster as Sonner,
  type ToasterProps
} from "@rzl-zone/docs-ui/components/sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  X
} from "@rzl-zone/docs-ui/components/icons/lucide";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group  "
      icons={{
        success: <CircleCheckIcon className="font-extrabold size-5" />,
        info: <InfoIcon className="font-extrabold size-5" />,
        warning: <TriangleAlertIcon className="font-extrabold size-5" />,
        error: <OctagonXIcon className="font-extrabold size-5" />,
        loading: <Loader2Icon className="font-extrabold size-5 animate-spin" />,
        close: (
          <X
            className={cn(
              "font-semibold size-3.75",
              "hover:size-4 hover:font-extrabold"
            )}
          />
        )
      }}
      style={
        {
          // "--normal-bg": "var(--color-fd-popover)",
          // "--normal-text": "var(--color-fd-popover-foreground)",
          // "--normal-border": "var(--color-fd-border)",
          "--border-radius": "var(--radius)"
        } as React.CSSProperties
      }
      toastOptions={{
        className:
          "text-slate-100! border-[1.5px]! border-slate-50! p-3! pl-6! text-sm! rounded-xl!",
        classNames: {
          icon: cn("mx-0!"),
          closeButton: cn(
            "text-white! hover:text-white!",
            "border-[1.5px]! border-slate-50!"
          ),
          success: cn(
            "bg-green-600! outline-2! outline-green-600!",
            "[&>button]:bg-green-600!",
            "[&>button]:outline-2! [&>button]:outline-green-600!"
            // "[&>button>svg]:hover:size-4! [&>button>svg]:hover:font-extrabold!"
          ),
          error: cn(
            "bg-red-600! outline-2! outline-red-600!",
            "[&>button]:bg-red-600!",
            "[&>button]:outline-2! [&>button]:outline-red-600!"
            // "[&>button>svg]:hover:size-4! [&>button>svg]:hover:font-extrabold!"
          ),
          warning: cn(
            "bg-orange-600! outline-2! outline-orange-600!",
            "[&>button]:bg-orange-600!",
            "[&>button]:outline-2! [&>button]:outline-orange-600!"
            // "[&>button>svg]:hover:size-4! [&>button>svg]:hover:font-extrabold!"
          ),
          info: cn(
            "bg-blue-500! outline-2! outline-blue-500!",
            "[&>button]:bg-blue-500!",
            "[&>button]:outline-2! [&>button]:outline-blue-500!"
            // "[&>button>svg]:hover:size-4! [&>button>svg]:hover:font-extrabold!"
          ),
          title: cn("font-bold!")
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
