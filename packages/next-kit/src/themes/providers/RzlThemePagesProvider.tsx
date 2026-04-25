import type { RzlThemeProviderProps } from "../types";
import ContainerThemePagesDir from "../internals/container/ProviderPagesDir";

/** ------------------------------------------------------------
 * * ***Provider wrapper for configuring and supplying the theme system (Pages Router).***
 * ------------------------------------------------------------
 * **Usage example in your `pages/_app.tsx`:**
 *
 * ```tsx
 * import type { AppProps } from "next/app";
 * import { RzlThemePagesProvider } from "@rzl-zone/next-kit/themes/pages";
 *
 * export default function MyApp({ Component, pageProps }: AppProps) {
 *   return (
 *     <>
 *       <RzlThemePagesProvider disableTransitionOnChange>
 *         <Component {...pageProps} />
 *       </RzlThemePagesProvider>
 *     </>
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
 * @param props - Property options of `RzlThemePagesProvider`.
 * @throws Will throw an error if `children` is not provided.
 * @returns A `<RzlThemePagesProvider>` wrapping the passed children.
 */
export const RzlThemePagesProvider = <EnablingSystem extends boolean = true>(
  props: RzlThemeProviderProps<EnablingSystem>
) => {
  return (
    <ContainerThemePagesDir<EnablingSystem> {...props}>
      {props.children}
    </ContainerThemePagesDir>
  );
};
