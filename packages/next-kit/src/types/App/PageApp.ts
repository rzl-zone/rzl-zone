/** -------------------------------------------------------------------
 * * ***Props definition for a Server Component Page in Next.js (App Router).***
 * -------------------------------------------------------------------
 *
 * This type is **only applicable for Server Components** (`page.tsx`)
 * as `searchParams` is automatically passed as a prop in Server Components.
 *
 * ⚠️ **Do not use this type in Client Components (`"use client"`)**.
 * For Client Components, use `useSearchParams()` from `next/navigation`.
 */
export type SearchParamsQueryPageApp = {
  /** Search parameters from the URL, automatically provided by Next.js */
  searchParams: Promise<{
    readonly [key: string]: string | string[] | undefined;
  }>;
};

/** -----------------------------------------------------------------------------
 * * ***📌 `SegmentParams` — Optional dynamic route parameters passed by Next.js (App Router).***
 * -----------------------------------------------------------------------------
 *
 * This type provides support for dynamic route parameters (`params`)
 * in Server Components or Route Handler (e.g.: `[id]/page.tsx` or [id]/route.ts).
 *
 * ⚠️ **Do not use this type in Client Components (`"use client"`)**.
 * For Client Components, use `useParams()` from `next/navigation`.
 *
 * @template T - The expected shape of the dynamic route parameters,
 *   or `unknown` if there are none.
 *
 * @property T - A promise that resolves to the route parameters object,
 *   only available for dynamic routes.
 */
export type SegmentParams<T extends object | unknown = unknown> =
  T extends Record<string, unknown>
    ? {
        params: Promise<{
          readonly [K in keyof T]: T[K] extends string
            ? T[K]
            : T[K] extends string[]
              ? T[K]
              : T[K] extends string | undefined
                ? T[K]
                : T[K] extends string[] | undefined
                  ? T[K]
                  : never;
        }>;
      }
    : { params: Promise<never> };

/** -------------------------------------------------------------------
 * * ***Generic type for **Server Component Page** props in Next.js (App Router).***
 * -------------------------------------------------------------------
 *
 * This type should **only be used in Server Components (`page.tsx`)**,
 * where Next.js automatically provides `searchParams` as a prop.
 *
 * **❌ Do not use this in Client Components (`"use client"`).**
 *
 * If you need to access search parameters in a Client Component,
 * use `useSearchParams()` from `next/navigation` instead. And if you need to access params in a Client Component,
 * use `useParams()` from `next/navigation` instead.
 *
 * ---
 *
 * - Extends `SearchParamsQueryPageApp` to ensure `searchParams` is available.
 *
 * @template ParamsPage - Optional dynamic route parameters (e.g., `{ id: string }`).
 *
 * **Usage Example (Server Component only):**
 *
 * #*Example 1:*
 *
 * ```tsx
 * export default function Page({ searchParams }: PageAppProps) {
 *   console.log(searchParams);
 *   return <div>Server Component Page</div>;
 * }
 * ```
 *
 * #*Example 2:*
 *
 * ```tsx
 * type DataParamsProps = { id:string; };
 *
 * export default function Page({ searchParams,params }: PageAppProps<DataParamsProps>) {
 *   console.log(searchParams);
 *   console.log(params.id); // return -> typeof `id` is string if in your hierarchy folder Server Components is (e.g., `[id]/page.tsx`).
 *   return <div>Server Component Page</div>;
 * }
 * ```
 */
export type PageAppProps<ParamsPage extends object | unknown = unknown> =
  SegmentParams<ParamsPage> & SearchParamsQueryPageApp;
