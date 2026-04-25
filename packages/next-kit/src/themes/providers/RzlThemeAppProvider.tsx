"use client";

import ContainerThemeAppDir from "../internals/container/ProviderAppDir";

import type { RzlThemeProviderProps } from "../types";

/** ------------------------------------------------------------
 * * ***Provider wrapper for configuring and supplying the theme system (App Router).***
 * ------------------------------------------------------------
 * **Usage example in your `app/layout.tsx`:**
 *
 * ```tsx
 * import { RzlThemeAppProvider } from "@rzl-zone/next-kit/themes/app";
 *
 * export default function RootLayout({ children }: { children: ReactNode }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <body>
 *         <RzlThemeAppProvider disableTransitionOnChange>
 *           {children}
 *         </RzlThemeAppProvider>
 *       </body>
 *     </html>
 *   );
 * };
 * ```
 * ---
 * - **ℹ️ Tip ***(Recommended)***:**
 *    - If you pass custom themes (e.g. `themes={["pink","blue"]}`) to provider,
 *      remember to add a corresponding override for type-safety:
 *      ```ts
 *
 *      import "@rzl-zone/next-kit/themes";
 *
 *      declare module "@rzl-zone/next-kit/themes" {
 *        interface ThemeOverrideConfig {
 *          themes: ["pink", "blue"]; // or themes?: [...];
 *        }
 *      }
 *      ```
 * @param props - Property options of `RzlThemeAppProvider`.
 * @throws Will throw an error if `children` is not provided.
 * @returns A `<RzlThemeAppProvider>` wrapping the passed children.
 */
export const RzlThemeAppProvider = <EnablingSystem extends boolean = true>(
  props: RzlThemeProviderProps<EnablingSystem>
) => {
  return (
    <ContainerThemeAppDir<EnablingSystem> {...props}>
      {props.children}
    </ContainerThemeAppDir>
  );
};
