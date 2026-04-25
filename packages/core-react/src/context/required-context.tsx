"use client";

import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";
import React, { createContext, useContext, type ReactNode } from "react";

type UnwrapPromise<T> = ContextValue<T extends Promise<infer U> ? U : T>;
type ContextValue<T> = T extends undefined ? never : T;

type RequiredContextProviderProps<T> = {
  readonly value: T;
  readonly children: ReactNode;
};

type RequiredContextProvider<T> = {
  (props: RequiredContextProviderProps<T>): ReactNode;
  displayName?: string;
};

type RequiredContextReturn<T> = {
  /** ------------------------------------------------------------------------
   * * ***React Context instance (advanced usage).***
   * ------------------------------------------------------------------------
   *
   * ⚠️ **Advanced usage only**
   *
   * - ***This context is exposed for:***
   *    - Integration with third-party libraries.
   *    - Adapter layers.
   *    - Testing or devtools.
   *
   * - ***Important notes:***
   *    - The value type is `T | undefined`.
   *    - `undefined` is reserved internally to detect missing Providers.
   *    - Consumers SHOULD prefer `use()` or `useSuspense()` instead of
   *      calling `useContext(Context)` directly.
   *
   * @example
   * **1. Adapter / integration layer.**
   * ```tsx
   * // Example: integrating with a third-party hook
   * // that requires a raw React Context instance.
   *
   * import { useContext } from "react";
   *
   * type AuthState = { user: { name: string, email: string } };
   *
   * function useAuthFromAdapter(AuthContext: {
   *   Context: React.Context<AuthState | undefined>;
   * }) {
   *   const value = useContext(AuthContext.Context);
   *
   *   // Adapter is responsible for handling `undefined`
   *   if (value === undefined) {
   *     throw new Error("AuthContext.Provider is missing");
   *   }
   *
   *   return value;
   * }
   * ```
   *
   * @example
   * **2. Testing or devtools.**
   * ```tsx
   * import { render } from "@testing-library/react";
   *
   * render(
   *   <AuthContext.Context.Provider value={{ user: { name: "Rzl" } }}>
   *     <ComponentUnderTest />
   *   </AuthContext.Context.Provider>
   * );
   * ```
   */
  Context: React.Context<T | undefined>;

  /** ------------------------------------------------------------------------
   * * ***Context Provider component.***
   * ------------------------------------------------------------------------
   *
   * Provides the context value to the component subtree.
   *
   * - ⚠️ ***Important:***
   *    - `undefined` is **reserved internally** to detect missing Providers.
   *    - Do **NOT** pass `undefined` as a valid value.
   *    - If you need to represent an “empty” or “not yet available” state,
   *      use `null` instead and handle it explicitly in consumers.
   *
   * @example
   * ```tsx
   * type AuthState = { user: { name: string } } | null;
   *
   * const AuthContext =
   *   createRequiredContext<AuthState>("AuthContext", null);
   *
   * function App() {
   *   return (
   *     <AuthContext.Provider value={{ user: { name: "Rzl" } }}>
   *       <UserComponent />
   *     </AuthContext.Provider>
   *   );
   * }
   *
   * function UserComponent() {
   *   const userContext = AuthContext.use();
   *
   *   if (userContext === null) throw new Error("UserContext is null");
   *
   *   return <div>{userContext.user.name}</div>;
   * }
   * ```
   */
  Provider: RequiredContextProvider<T>;

  /** ------------------------------------------------------------------------
   * * ***Classic context consumer (non-Suspense).***
   * ------------------------------------------------------------------------
   *
   * Reads the context value synchronously using `useContext`.
   *
   * - ***Behavior:***
   *    - Throws if the Provider is missing.
   *    - Filters **only `undefined`** (used internally to detect missing Provider).
   *    - `null` is treated as a valid value and is **not** filtered.
   *    - Never suspends.
   *    - Does NOT require `<Suspense>`.
   *
   * @param missingProviderMessage - Optional custom error message when used outside its Provider.
   *
   * @throws {Error} Thrown when used outside its corresponding Provider.
   *
   * @returns The context value of type `T`.
   *
   * @example
   * ```tsx
   * type Theme = { theme: "light" | "dark" };
   *
   * const ThemeContext = createRequiredContext<Theme>("ThemeContext");
   *
   * function App() {
   *   return (
   *     <ThemeContext.Provider value={{ theme: "dark" }}>
   *       <ThemeToggle />
   *     </ThemeContext.Provider>
   *   );
   * }
   *
   * function ThemeToggle() {
   *   const { theme } = ThemeContext.use();
   *   return <button data-theme={theme} />;
   * }
   * ```
   */
  use(missingProviderMessage?: string): ContextValue<T>;

  /** ------------------------------------------------------------------------
   * * ***React 19 `use()`-powered context consumer (Promise-aware).***
   * ------------------------------------------------------------------------
   *
   * Reads the context value using React 19 `use(Context)`.
   *
   * - ***Behavior:***
   *    - Throws if the Provider is missing.
   *    - Filters **only `undefined`**.
   *    - If the value is a Promise, rendering suspends until it resolves.
   *    - If the value is synchronous, behaves like `useContext`.
   *
   * - ***⚠️ When the value is a Promise:***
   *    - A `<Suspense>` boundary is ***REQUIRED***.
   *    - The Promise must come from a Suspense-compatible source
   *      (*not created during render*).
   *
   * ---
   *
   * ⚠️ This hook **requires** ***React 19*** or ***newer***, If used in an older React version, it will throw an error.
   *
   * ---
   *
   * @param missingProviderMessage - Optional custom error message when used outside its Provider.
   * @param unsupportedReactErrorMessage  - Optional custom error message when `use()` is not supported (React < 19).
   *
   * @throws {Error}
   * Thrown when:
   * - Used outside its corresponding Provider.
   * - React version is older than 19 and does not support `use`.
   *
   * @returns The resolved context value.
   *
   * @example
   * ```tsx
   * type User = { name: string };
   *
   * const userPromise: Promise<User> = fetch("/api/user").then(r => r.json());
   *
   * const UserContext =
   *   createRequiredContext<Promise<User>>("UserContext");
   *
   * function App() {
   *   return (
   *     <UserContext.Provider value={userPromise}>
   *       <Suspense fallback="Loading...">
   *         <Profile />
   *       </Suspense>
   *     </UserContext.Provider>
   *   );
   * }
   *
   * function Profile() {
   *   const user = UserContext.useSuspense();
   *   return <div>{user.name}</div>;
   * }
   * ```
   */
  useSuspense(
    missingProviderMessage?: string,
    unsupportedReactErrorMessage?: string
  ): UnwrapPromise<T>;
};

/** --------------------------------------------------------------------------
 * * ***Create a React Context with a required Provider.***
 * --------------------------------------------------------------------------
 *
 * - ***This utility enforces that:***
 *    - The context **must** be wrapped with its Provider.
 *    - Using the context without a Provider throws a clear runtime error.
 *
 * - ⚠️ ***Important behavior:***
 *    - Only **`undefined`** is treated as an invalid value.
 *    - Passing `undefined` (explicitly or implicitly) will cause the consumer
 *      to throw a runtime error.
 *    - **`null` is allowed** and will be returned as-is.
 *
 * ---
 *
 * ℹ️ If you need an “empty” or “initial” state, prefer `null` instead of `undefined`.
 *
 * ---
 *
 * - ***Supports two consumption modes:***
 *    - `use()` ➔ classic `useContext` (non-suspending, filters `undefined`).
 *    - `useSuspense()` ➔ React 19 `use()` (Promise-aware, filters `undefined`).
 *
 * - ***Designed for:***
 *    - Application-level state.
 *    - Shared library contexts.
 *    - Fail-fast enforcement of required Providers.
 *
 * @template T - The context value type, `undefined` is reserved internally to detect missing Providers.
 *
 * @param name - Human-readable context name (used in error messages and React DevTools).
 *
 * @returns An object containing:
 * - `Context` — the raw React Context instance (advanced usage).
 * - `Provider` — the required Provider component.
 * - `use` — classic context consumer hook, throws if Provider is missing.
 * - `useSuspense` — React 19+ Suspense-aware consumer hook, throws if Provider is missing or React version is too old.
 *
 * @example
 * **1. Context with a default value.**
 * ```tsx
 * type AuthState = {
 *    user: {
 *      name: string
 *    }
 * } | null;
 *
 * const AuthContext =
 *   createRequiredContext<AuthState>("AuthContext", null);
 *
 * function App() {
 *   return (
 *     <AuthContext.Provider value={{ user: { name: "Rzl" } }}>
 *       <UserComponent />
 *     </AuthContext.Provider>
 *   );
 * }
 *
 * function UserComponent() {
 *   const userContext = AuthContext.use();
 *
 *   if (userContext === null) throw new Error("UserContext is null");
 *
 *   return <div>{userContext.user.name}</div>;
 * }
 * ```
 *
 * @example
 * **2. Context without a default value (Provider required).**
 * ```tsx
 * type Theme = { theme: "light" | "dark" };
 *
 * const ThemeContext = createRequiredContext<Theme>("ThemeContext");
 *
 * function App() {
 *   return (
 *     <ThemeContext.Provider value={{ theme: "dark" }}>
 *       <ThemeToggle />
 *     </ThemeContext.Provider>
 *   );
 * }
 *
 * function ThemeToggle() {
 *   const { theme } = ThemeContext.use();
 *   return <button data-theme={theme} />;
 * }
 * ```
 *
 * @example
 * **3. Async (Promise) context with Suspense.**
 * ```tsx
 * type User = { name: string };
 *
 * const userPromise: Promise<User> = fetch("/api/user").then(r => r.json());
 *
 * const UserContext =
 *   createRequiredContext<Promise<User>>("UserContext");
 *
 * function App() {
 *   return (
 *     <UserContext.Provider value={userPromise}>
 *       <Suspense fallback="Loading...">
 *         <Profile />
 *       </Suspense>
 *     </UserContext.Provider>
 *   );
 * }
 *
 * function Profile() {
 *   const user = UserContext.useSuspense();
 *   return <div>{user.name}</div>;
 * }
 * ```
 */
export function createRequiredContext<T>(
  name: string,
  defaultValue: T
): RequiredContextReturn<T>;
export function createRequiredContext<T>(
  name: string
): RequiredContextReturn<T | undefined>;
export function createRequiredContext<T>(
  name: string,
  defaultValue?: T
): RequiredContextReturn<T | undefined> {
  if (!isNonEmptyString(name)) {
    throw new Error(
      "Invalid `context` name passed to `createRequiredContext`: expected a non-empty string."
    );
  }

  name = name.trim();

  const { contextDisplayName, providerDisplayName } =
    normalizeContextNames(name);

  /** ------------------------------------------------------------------------
   * * ***React Context instance (advanced usage).***
   * ------------------------------------------------------------------------
   */
  const Context = createContext<T | undefined>(defaultValue);
  Context.displayName = contextDisplayName;

  /** ------------------------------------------------------------------------
   * * ***Context Provider component.***
   * ------------------------------------------------------------------------
   */
  function Provider(props: RequiredContextProviderProps<T | undefined>) {
    return (
      <Context.Provider value={props.value}>{props.children}</Context.Provider>
    );
  }

  Provider.displayName = providerDisplayName;

  /** ------------------------------------------------------------------------
   * * ***Hook to consume the context value safely.***
   * ------------------------------------------------------------------------
   */
  function useRequiredContext(
    missingProviderMessage?: string
  ): ContextValue<T> {
    const value = useContext(Context);

    if (value === undefined) {
      throw new Error(
        missingProviderMessage ??
          `You are using \`${contextDisplayName}\`, but your component is not wrapped with <${providerDisplayName}>.\n` +
            `Did you forget to add <${providerDisplayName}> to your component tree?`
      );
    }

    return value as ContextValue<T>;
  }

  /** ------------------------------------------------------------------------
   * * ***Suspense consumer (React 19).***
   * ----------------------------------------------------------------------
   */
  function useRequiredContextSuspense(
    missingProviderMessage?: string,
    unsupportedReactErrorMessage?: string
  ): UnwrapPromise<T> {
    //
    // eslint-disable-next-line @rzl-zone/eslint/no-react19-api
    if (typeof React?.use !== "function" || !("use" in React)) {
      throw new Error(
        unsupportedReactErrorMessage ??
          "This feature requires `React 19` or `newer`, please upgrade your React version to use Suspense-enabled context."
      );
    }

    // eslint-disable-next-line @rzl-zone/eslint/no-react19-api
    const value = React.use(Context);

    if (value === undefined) {
      throw new Error(
        missingProviderMessage ??
          `You are using \`${contextDisplayName}\`, but your component is not wrapped with <${providerDisplayName}>.\n` +
            `Did you forget to add <${providerDisplayName}> to your component tree?`
      );
    }

    return value as UnwrapPromise<T>;
  }

  return {
    Context,
    Provider,
    use: useRequiredContext,
    useSuspense: useRequiredContextSuspense
  };
}

function normalizeContextNames(name: string) {
  const trimmed = name.trim();

  const baseName = /context$/i.test(trimmed)
    ? trimmed.replace(/context$/i, "")
    : trimmed;

  const contextDisplayName = `${baseName}Context`;
  const providerDisplayName = `${baseName}Provider`;

  return {
    baseName,
    contextDisplayName,
    providerDisplayName
  };
}
