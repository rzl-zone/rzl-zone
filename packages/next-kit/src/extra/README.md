<h1 align="center">
<sup>Rzl Next.JS Utils EXTRA</sup>
<br />
</h1>

(Forked from [next-extra](https://github.com/shahradelahi/next-extra) by [Shahrad Elahi](https://github.com/shahradelahi)).

**@rzl-zone/next-kit/extra** is a customized fork of [next-extra](https://github.com/shahradelahi/next-extra).
It is a utility package designed to enhance your Next.js projects with additional methods not available in the original package.
This version includes improvements such as:

- Clear and informative error messages
- Extended TypeScript support with proper JSDoc/tsDoc annotations
- Additional utility functions tailored for real-world usage
  > Perfect for projects that require better DX (developer experience) and structured runtime handling.

---

- [📖 Usage](#-usage)
  - [`@rzl-zone/next-kit/extra/action`](#rzl-zonenext-kitextraaction) - [API](#api) - [Example](#example)
  - [`@rzl-zone/next-kit/extra/context`](#rzl-zonenext-kitextracontext) - [API](#api-1) - [Example](#example-1)
  - [`@rzl-zone/next-kit/extra/pathname`](#rzl-zonenext-kitextrapathname) - [API](#api-2) - [Example](#example-2)
- [🤝 Contributing](#-contributing)

## 📖 Usage

### `@rzl-zone/next-kit/extra/action`

###### API

```typescript
function createAction(fn: Function): ActionFunc;
function actionError(code: string, message: string): never;
function cookies(): ResponseCookies;
function clientIP(): Promise<string | null>;
```

###### Example

```typescript jsx
// -- actions.ts
"use server";

import { actionError, createAction } from "@rzl-zone/next-kit/extra/action";

export const hello = createAction(async (name: string) => {
  if (!name) {
    actionError("NAME_REQUIRED", "Name is required");
  }
  return `Hello, ${name}!`;
});
```

```typescript jsx
// -- page.tsx
import { hello } from './actions';

export default async function Page() {
  const { data, error } = await hello('John');
  if (error) {
    return <h1>ERROR: {error.message}</h1>;
  }
  return <h1>{data}</h1>;
}
```

### `@rzl-zone/next-kit/extra/context`

This module provides utilities for passing serializable data from the **server layout** to **client page components** in the Next.js [App Router](https://nextjs.org/docs/app). It is particularly useful for sharing context-specific data across your application without the need to re-fetch data, thereby saving computing resources and improving performance.

###### API

```typescript
function PageContext<T>(props: PageContextProps<T>): JSX.Element;
function usePageContext<T>(): Readonly<T>;
function useServerInsertedContext<T>(): Readonly<T | undefined>;
```

###### Example

```typescript jsx
// -- layout.tsx
import { PageContext } from '@rzl-zone/next-kit/extra/context';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <PageContext data={{ ts: Date.now() }}>{children}</PageContext>;
}
```

```typescript jsx
// -- quotes/layout.tsx
import { PageContext } from '@rzl-zone/next-kit/extra/context';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <PageContext data={{ quote: 'Guillermo Rauch is a handsome dude!' }}>{children}</PageContext>;
}
```

```typescript jsx
// -- quotes/page.tsx
'use client';

import { useServerInsertedContext, usePageContext } from '@rzl-zone/next-kit/extra/context';

interface Context {
  message: string;
}

interface InsertedContext extends Context {
  ts: number;
}

export default function Page() {
  const insertedCtx = useServerInsertedContext<InsertedContext>();
  console.log(insertedCtx); // undefined in server or Object { ts: ..., message: "..." }

  const ctx = usePageContext<Context>();
  console.log(ctx); // Object { message: "..." }

  return <h3>Message: {ctx.message}</h3>;
}
```

### `@rzl-zone/next-kit/extra/pathname`

Access `pathname` and `searchParams` of the incoming request for server-side components in the [App Router](https://nextjs.org/docs/app).

###### API

```typescript
function getPathname(): Promise<string>;
function getSearchParams(): Promise<ReadonlyURLSearchParams>;
```

###### Example

```typescript
import {
  getPathname,
  getSearchParams
} from "@rzl-zone/next-kit/extra/getPathname";

export default async function Layout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  // Assuming a request to "/hello?name=John"

  const route = await getPathname(); // /hello
  const params = await getSearchParams(); // ReadonlyURLSearchParams { 'name' => 'John' }

  return children;
}
```

## 🤝 Contributing

This project is heavily inspired by and based on [Shahrad Elahi](https://github.com/shahradelahi), originally developed.
