"use client";

import React from "react";

import { delay } from "@rzl-zone/utils-js/promises";
import { toPascalCaseSpace } from "@rzl-zone/utils-js/strings";

import { useTheme } from "@rzl-zone/next-kit/themes";

import { cn, cva } from "@rzl-zone/docs-ui/utils";
import { toast } from "@rzl-zone/docs-ui/components/sonner";
import { Button } from "@rzl-zone/docs-ui/components/button";
import { Moon, Sun, Airplay } from "@rzl-zone/docs-ui/components/icons/lucide";

const itemVariants = cva(
  "size-6.5 rounded-full p-1.5 text-fd-muted-foreground",
  {
    variants: {
      active: {
        true: "bg-fd-accent text-fd-accent-foreground",
        false: "text-fd-muted-foreground"
      }
    }
  }
);

const full = [
  ["light", Sun] as const,
  ["dark", Moon] as const,
  ["system", Airplay] as const
] as const;

const showingToast = (currentTheme: string) => {
  delay(50).then(() => {
    toast.info(`${toPascalCaseSpace(currentTheme)} Theme Active!`, {
      duration: 1250,
      closeButton: false
    });
  });
};

export function ThemeToggle({
  className,
  mode = "light-dark",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  mode?: "light-dark" | "light-dark-system";
}) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const setMounting = React.useEffectEvent((mount: boolean) => {
    setMounted(mount);
  });

  React.useLayoutEffect(() => {
    setMounting(true);
  }, []);

  const container = cn(
    "inline-flex items-center rounded-full border p-1",
    className
  );

  const value = mounted
    ? mode === "light-dark"
      ? resolvedTheme
      : theme
    : null;

  return (
    <div
      className={container}
      data-rzl-theme-toggle={value}
      {...props}
    >
      {full.map(([key, Icon], idx) => {
        if (mode === "light-dark" && key === "system") return null;

        return (
          <Button
            variant={"ghost"}
            tabIndex={-1}
            key={`${key}_${((idx / 2) * 18) / 21}`}
            aria-label={key}
            className={cn(itemVariants({ active: value === key }))}
            onClick={async (e) => {
              if (value === key) {
                return e.preventDefault();
              }

              React.startTransition(() => {
                setTheme(key);
                showingToast(key);
              });
            }}
          >
            <Icon
              className="size-full"
              fill="currentColor"
            />
          </Button>
        );
      })}
    </div>
  );
}
