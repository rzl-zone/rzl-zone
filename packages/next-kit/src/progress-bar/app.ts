"use client";

import { WithSuspense } from "@/hoc";
import InitNextAppProgressBar from "./components";

/** ------------------------------------------------------------------
 * * ***Component: `RzlNextAppProgressBar`.***
 * ------------------------------------------------------------------
 * **A lightweight progress bar optimized for the Next.js `App Router`.**
 *
 * This component is compatible **with the App Router only** and is not
 * intended for use inside the Pages Router.
 *
 * Wrapped with `WithSuspense` to ensure full support for Suspense and
 * lazy-loaded UI boundaries also using `React.memo` to prevent unnecessary
 * re-renders and improve performance during client-side navigation events.
 *
 * - **Features**:
 *    - Renders a lightweight progress bar during route transitions.
 *    - Fully configurable via `RzlNextProgressBarProps`.
 *    - Supports optional delays, force-stop, and UI interaction locking.
 *    - Compatible with client-side navigation and Suspense.
 *    - Designed for seamless integration with Next.js App Router.
 *
 * @returns {React.JSX.Element} Returns the `RzlNextAppProgressBar` component.
 *
 * @example
 * * Basic usage:
 * ```tsx
 * import { RzlNextAppProgressBar } from "@rzl-zone/next-kit/progress-bar/app";
 *
 * export default function Layout({ children }: React.ReactNode) {
 *   return (
 *     <html>
 *       <body>
 *         <RzlNextAppProgressBar />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export const RzlNextAppProgressBar = WithSuspense(InitNextAppProgressBar);
export { InitNextAppProgressBar };
export { useRouter } from "./hooks";
