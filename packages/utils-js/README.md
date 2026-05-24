<div align="center" style="display: flex; flex-direction: column; align-items: center;gap: 0rem">
  <a target="_blank" rel="noopener noreferrer" href="https://raw.githubusercontent.com/rzl-zone/rzl-zone/main/logo-circle.png">
    <img src="https://raw.githubusercontent.com/rzl-zone/rzl-zone/main/logo-circle.png" align="middle" alt="RzlZone Logo" width="110" style="max-width: 100%;" />
  </a>
</div>

<h1 align="center"><strong>Utils JS</strong></h1>

<p align="center">
  <i>
    A lightweight, modern TypeScript utility library for Node.js & browser (via bundlers like <a href="https://webpack.js.org/"><code>Webpack</code></a>, <a href="https://vercel.com/blog/turbopack/"><code>Turbopack</code></a>, <a href="https://rollupjs.org/"><code>Rollup</code></a>, <a href="https://esbuild.github.io/"><code>esbuild</code></a>, and higher-level tools like <a href="https://vite.dev/"><code>Vite</code></a>, <a href="https://tsup.egoist.dev/"><code>tsup</code></a> and <a href="https://tsdown.dev/"><code>tsdown</code></a>).
  </i><br/>
  <i>It provides reusable helpers to simplify everyday JavaScript and TypeScript tasks projects.</i><br/>
  <strong><i>Built with ❤️ by <a href="https://github.com/rzl-zone" target="_blank" rel="nofollow noreferrer noopener">@rzl-zone</a>.</i></strong>
</p>

<div align="center">
  <p>
    <a href="https://npmjs.com/package/@rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/npm/v/@rzl-zone/utils-js?logo=npm&label=Latest%20Version&color=4CAF50&logoColor=CB3837&style=flat-rounded" alt="Latest Version on NPM" />
    </a>
    <a href="https://npmjs.com/package/@rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/npm/dt/@rzl-zone/utils-js?logo=npm&label=Total%20Downloads&color=007EC6&logoColor=CB3837&style=flat-rounded" alt="NPM Total Downloads" />
    </a>
    <a href="https://npmjs.com/package/@rzl-zone/utils-js" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/npm/dw/@rzl-zone/utils-js?logo=npm&label=Weekly%20Downloads&color=CB3837&logoColor=CB3837&style=flat-rounded" alt="NPM Weekly Downloads" />
    </a>
    <a href="https://nodejs.org/en/" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/Node.js-18.18.0%2B-green.svg?logo=node.js&color=339933&style=flat-rounded" alt="Node.js" />
    </a>
    <a href="https://github.com/rzl-zone/rzl-zone/blob/main/CONTRIBUTING.md" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?color=28A745" alt="PRs Welcome" />
    </a>
    <a href="https://github.com/rzl-zone/rzl-zone/blob/main/LICENSE" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg?color=3DA639" alt="GitHub license" />
    </a>
    <a href="https://github.com/rzl-zone/rzl-zone/tree/main/packages/utils-js" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/Repo-on%20GitHub-181717?logo=github" alt="GitHub" />
    </a>
    <a href="https://github.com/rzl-zone/rzl-zone" target="_blank" rel="nofollow noreferrer noopener">
      <img src="https://img.shields.io/badge/Org-rzl--zone-24292e?logo=github&style=flat-rounded" alt="Repo on GitHub" />
    </a>
  </p>
</div>

---

<h2 id="table-of-contents">📚 <strong>Table of Contents</strong></h2>

- 💻 [Requirements](#requirements)
- ⚙️ [Installation](#installation)
- ✨ [Features](#features)
- 💎 [Detailed Features](#detailed-features)
  - [Full Documentation](#detailed-features--full-documentation)
  - [CDN Usage](#detailed-features--cdn-usage)
  - [Hint Autocomplete](#detailed-features--hint-autocomplete-setup)
- 🔥 [Usage](#usage)
- ❤️ [Sponsor](#sponsor-this-package)
- 📜 [Changelog](#changelog)
- 🤝 [Contributing](#contributing)
- 🔒 [Security](#security)
- 🙌 [Credits](#credits)
- 📄 [License](#license)

---

<h2 id="requirements">💻 <strong>Requirements</strong></h2>

- **Node.js `≥18.18.0`**  
  This package leverages modern JavaScript & TypeScript features that require Node.js version 18.18.0.

- **Works with:**
  - ✅ Node.js (18.18.0+).
  - ✅ Modern browsers (via **ESM-compatible** bundlers such as [`Webpack`](https://webpack.js.org/), [`Turbopack`](https://vercel.com/blog/turbopack), [`Rollup`](https://rollupjs.org/), [`esbuild`](https://esbuild.github.io/), and higher-level tools like [`Vite`](https://vite.dev/), [`tsup`](https://tsup.egoist.dev/), and [`tsdown`](https://tsdown.dev/)).

- **TypeScript Build Info:**
  - Target: `ES2022`.
  - Module: `ES2022`.
  - Module Resolution: `bundler`.

  <br/>
  
  > ℹ️ Note:  
  > These TypeScript settings are used to build the package, consumers do **not** need to match these settings unless they plan to build or modify the source code.

---

<h2 id="installation">⚙️ <strong>Installation</strong></h2>

#### *With NPM*

```bash
npm install @rzl-zone/utils-js@latest
```

#### *With Yarn*

```bash
yarn add @rzl-zone/utils-js@latest
```

#### *With PNPM*

```bash
pnpm add @rzl-zone/utils-js@latest
```

---

<h2 id="features">✨ <strong>Features</strong></h2>

- 🚀 Written in **TypeScript** — fully typed & safe.
- ⚡ Small, tree-shakable & fast.
- 📦 Works in **Node.js** & modern browsers.
- ❤️ Simple API, easy to extend.

---

<h2 id="nextjs-support">🧬 <strong>Next.js Support</strong></h2>

> ⚠️ Starting from version `3.13.0`, the following Next.js entry points were removed from `@rzl-zone/utils-js` and migrated into the dedicated package <a href="https://www.npmjs.com/package/@rzl-zone/next-kit" target="_blank" rel="nofollow noreferrer noopener"><code>@rzl-zone/next-kit</code></a>.
>
> Migrated entry points:
>
> - `@rzl-zone/utils-js/next` ➔ `@rzl-zone/next-kit/utils`
> - `@rzl-zone/utils-js/next/server` ➔ `@rzl-zone/next-kit/utils/server`

---

<h2 id="detailed-features">💎 <strong>Detailed Features</strong></h2>

<h3 id="detailed-features--full-documentation">
  <strong>
    The full <a href="https://rzlzone.vercel.app/docs/utils-js" target="_blank" rel="nofollow noreferrer noopener">UtilsJS</a> documentation is
    <strong>currently under construction 🏗️</strong>.
  </strong>
</h3>

#### For now, explore the examples or dive into the source — all utilities are documented via **TSDoc** and typed properly.
  
  ```ts
  import { /* … */ } from "@rzl-zone/utils-js/assertions";
  import { /* … */ } from "@rzl-zone/utils-js/conversions"; 
  import { /* … */ } from "@rzl-zone/utils-js/errors";
  import { /* … */ } from "@rzl-zone/utils-js/events";
  import { /* … */ } from "@rzl-zone/utils-js/formatters";
  import { /* … */ } from "@rzl-zone/utils-js/generators";
  import { /* … */ } from "@rzl-zone/utils-js/operations";
  import { /* … */ } from "@rzl-zone/utils-js/parsers";
  import { /* … */ } from "@rzl-zone/utils-js/predicates";
  import { /* … */ } from "@rzl-zone/utils-js/promises";
  import { /* … */ } from "@rzl-zone/utils-js/strings";
  import { /* … */ } from "@rzl-zone/utils-js/tailwind";
  import { /* … */ } from "@rzl-zone/utils-js/urls"; 
  ```

#### Place your cursor inside `{ }` or right after the package path `@rzl-zone/utils-js/<put-cursor-here>`, then press Ctrl+Space (Windows/Linux) or Cmd+Space (macOS), or use your editor’s autocomplete shortcut, to see all available functions and types with full TSDoc hints.

  ---
  
  <h3 id="detailed-features--cdn-usage">
    <strong>
      CDN Usage.
    </strong>
  </h3>

#### **Including via CDN:**

  ```xml
  <!-- jsDelivr -->
  <script src="https://cdn.jsdelivr.net/npm/@rzl-zone/utils-js@latest"></script>

  <!-- unpkg -->
  <script src="https://unpkg.com/@rzl-zone/utils-js@latest"></script>
  ```

  > ⚠️ **Note:**  
  > When using the library via CDN in the browser:  
  >
  > - Always include first the `<script/>` tag before your own scripts when using the CDN version.
  > - Some Node.js-specific utilities may **not** be available, e.g.:  
  >   - Category utils of `tailwind`.  
  >   - Any `server-only` features will **not** be available.  
  > - The global object provided is `RzlUtilsJs`.  
  > - The CDN bundle is **~373KB+ minified**, for production, consider using bundlers or npm packages for smaller size and tree-shaking.

---

<h3 id="detailed-features--hint-autocomplete-setup">
  <strong>
    Hint: Autocomplete Setup (Step by Step).
  </strong>
</h3>

Improve TypeScript editor import suggestions for `@rzl-zone/utils-js`, so all functions, types, and modules appear instantly when triggering autocomplete — press `Ctrl+Space` (**Windows/Linux**), `⌘+Space` (**macOS**), or your editor’s autocomplete shortcut.

This works across modern TypeScript-supported editors (e.g., `VSCode`, `WebStorm`, `Vim extensions`, `NeoVim LSP`, `Cursor`) without requiring triple-slash references — the package is fully indexed automatically through your editor’s TypeScript language service, follow steps:

- 1️⃣ **Install @rzl-zone/utils-js.**
  - Make sure the package is installed, see [**Installation Guide**](#installation).

- 2️⃣ **Create a types folder.**
  - Inside your project root, make a folder called `types`:

    ```pgsql
    project-root/
      ├─ src/
      ├─ types/
      │  └─ index.d.ts
      ├─ tsconfig.json
      └─ jsconfig.json
    ```

- 3️⃣ **Add the global reference file.**
  - Create `types/index.d.ts` with this content:

    ```ts
    /// <reference types="@rzl-zone/utils-js/.references" />
    ```

  - You can add more references here if needed, for example:

    ```ts
    /// <reference types="@rzl-zone/utils-js/.references" />

    // eg more references (if needed):
    /// <reference types="node" />
    /// <reference types="react" />
    ```

- 4️⃣ **Update tsconfig.json.**
  - Make sure add `types` folder to `"include"`, so **TypeScript** automatically picks up your types folder:

    ```jsonc
    // tsconfig.json
    {
      "compilerOptions": {
        "strict": true,
        // other your config...
      },
      "include": ["src", "types"]
      // other your config...
    }
    ```

- 5️⃣ **Update jsconfig.json (for JavaScript projects).**
  - If you also work with JS, do the same:

    ```jsonc
    // jsconfig.json
    {
      "compilerOptions": {
        "checkJs": true, // Optional, enables type checking
        // other your config...
      },
      "include": ["src", "types"]
      // other your config...
    }
    ```

    > ℹ️ ***Tip:*** *For JS projects, consider adding `"checkJs": true` for better IntelliSense.*

- 6️⃣ **Restart your editor/IDE.**
  - This forces your TypeScript language service to re-index the package.
  - After restart, **all functions, types, and modules from `@rzl-zone/utils-js` will appear instantly in autocomplete**.

---

<h2 id="usage">🔥 <strong>Usage</strong></h2>

### **Easy to use, just import on your code base.**

#### *Example Function Import:*

```ts
import { isServer } from "@rzl-zone/utils-js/predicates";

console.log(isServer());
// ➔ `true` if running on server-side, `false` if in browser.
```

---

<h2 id="sponsor-this-package">❤️ <strong>Sponsor this package</strong></h2>

**Help support development:**
*[👉 **Become a sponsor**](https://github.com/sponsors/rzl-app).*

---

<h2 id="changelog">📝 <strong>Changelog</strong></h2>

**See [CHANGELOG](https://github.com/rzl-zone/rzl-zone/blob/main/packages/utils-js/CHANGELOG.md).**

---

<h2 id="contributing">🤝 <strong>Contributing</strong></h2>

**See [CONTRIBUTING](https://github.com/rzl-zone/rzl-zone/blob/main/CONTRIBUTING.md).**

---

<h2 id="security">🔒 <strong>Security</strong></h2>

**Please report issues to [rzlzone.dev@gmail.com](mailto:rzlzone.dev@gmail.com).**

---

<h2 id="credits">🙌 <strong>Credits</strong></h2>

**- [Rzl App](https://github.com/rzl-app).**  
**- [All Contributors](https://github.com/rzl-zone/rzl-zone/graphs/contributors).**

---

<h2 id="license">📜 <strong>License</strong></h2>

**The MIT License (MIT).**  
*Please see **[License File](https://github.com/rzl-zone/rzl-zone/blob/main/LICENSE)** for more information.*

---

✅ **Enjoy using `@rzl-zone/utils-js`?**  
*Star the monorepo [⭐](https://github.com/rzl-zone/rzl-zone) and share it with other JavaScript developers!*  
📦 Explore other packages under [`@rzl-zone`](https://github.com/rzl-zone/rzl-zone)

---
