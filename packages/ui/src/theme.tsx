"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  ThemeProvider as NextThemeProvider,
  useTheme as nextThemes_useTheme,
} from "next-themes";
import type { ThemeProviderProps as NextThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";

import { Button } from "./components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/dropdown-menu";
import { Skeleton } from "./components/skeleton";

type Locale = "en" | "tr";

type Themes = "light" | "dark" | "system";
type Messages = {
  [key in Themes]: {
    [key in Locale]: string;
  };
};

export function ThemeToggle({ locale = "tr" }: Readonly<{ locale?: Locale }>) {
  const { setTheme, themes } = nextThemes_useTheme();

  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const messages = {
    light: {
      en: "Light",
      tr: "Açık",
    },
    dark: {
      en: "Dark",
      tr: "Koyu",
    },
    system: {
      en: "System",
      tr: "Sistem",
    },
  } as Messages;

  if (!mounted || !themes) return <Skeleton className="size-9 rounded-md" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setTheme(theme)}
            className="text-sm"
          >
            {messages[theme as Themes][locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeProvider({
  children,
  ...props
}: Readonly<NextThemeProviderProps>) {
  return (
    <NextThemeProvider
      storageKey="myy-theme"
      enableColorScheme
      enableSystem
      attribute="class"
      {...props}
    >
      {children}
    </NextThemeProvider>
  );
}

export function useTheme() {
  const mounted = React.useRef<boolean>(false);
  const config = nextThemes_useTheme();

  React.useEffect(() => {
    mounted.current = true;
  }, []);

  return { mounted: mounted.current, config };
}
