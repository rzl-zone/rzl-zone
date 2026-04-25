import { isNonEmptyString } from "@rzl-zone/utils-js/predicates";
import { minify_sync, type MinifyOptions as TsrOptions } from "terser";
import { transform, type Options as ScrsOption, type Transform } from "sucrase";

function cleanupVoidAwait(code: string) {
  return code.replace(/await void 0;?/g, "").replace(/;;+$/g, ";");
}

export type MinifyInnerHTMLScriptOptions = Omit<TsrOptions, "output"> & {
  typescriptOptions?: Partial<ScrsOption>;
  enableJsx?: boolean;
};

/** -------------------------------------------------------------------
 * * ***Minifies JavaScript/TypeScript code intended for inline `<script>`
 * usage by stripping types, removing debug statements, and compressing
 * output into a compact form.***
 * --------------------------------------------------------------------
 *
 * This function is designed for **runtime-safe minification in browser
 * environments**, combining lightweight syntax stripping with aggressive
 * compression.
 *
 * It supports two modes:
 *
 * - **Safe mode (default):**
 *      - Removes TypeScript syntax only.
 *      - Preserves JSX as-is.
 *      - Avoids injecting any runtime dependencies.
 *      - If JSX is present, the output may not be executable in plain
 *        JavaScript environments (JSX is preserved intentionally).
 *
 * - **JSX transform mode (`enableJsx: true`):**
 *      - Transforms JSX into function calls.
 *      - Produces valid JavaScript that can be minified.
 *      - May introduce runtime dependencies (e.g., React).
 *
 * - **What it does:**
 *      - Removes TypeScript syntax (types, interfaces, generics).
 *      - Optionally transforms JSX when enabled.
 *      - Preserves modern JavaScript features such as optional chaining
 *        (`?.`) and nullish coalescing (`??`).
 *      - Removes all `console.*` statements.
 *      - Collapses code into a compact single-line output.
 *      - Cleans up artifacts like `await void 0` and redundant semicolons.
 *
 * - **What it does NOT guarantee:**
 *      - Safe removal of runtime constructs like `enum` if they are used.
 *      - Preservation of `console` usage when shadowed or transformed.
 *      - Compatibility with all experimental or non-standard syntax.
 *      - Executable output when JSX is preserved (safe mode).
 *
 * This makes it suitable for **controlled inline scripts**, such as
 * injected helpers or optimized client-side snippets where size and
 * removal of debug code are priorities.
 *
 * @param script - The JavaScript or TypeScript source code to minify.
 * If not a valid string, an empty string is returned.
 *
 * @param options
 *  - ***Optional configuration:***
 *       - minifier options like compression, mangling and other.
 *       - `typescriptOptions` to customize transform behavior.
 *       - `enableJsx` to enable JSX transformation.
 *
 * @returns A minified JavaScript string safe for embedding inside
 * `<script>` tags.
 *
 * --------------------------------------------------------------------
 * @example
 * Basic TypeScript removal
 * ```ts
 * minifyInnerHTMLScript(`
 *   const a: number = 1;
 *   const b: number = 2;
 * `);
 * // => "const a=1,b=2;"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * Console removal
 * ```ts
 * minifyInnerHTMLScript(`
 *   const x = 1;
 *   console.log(x);
 * `);
 * // => "const x=1;"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * Optional chaining
 * ```ts
 * minifyInnerHTMLScript(`
 *   console?.log("hi");
 * `);
 * // => ""
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * Nested console calls
 * ```ts
 * minifyInnerHTMLScript(`
 *   foo(console.log("a"), 1);
 * `);
 * // => "foo(void 0,1);"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * Template literal cleanup
 * ```ts
 * minifyInnerHTMLScript(`
 *   const t = \`Value: \${console.log("test"), 123}\`;
 * `);
 * // => "const t=`Value: 123`;"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * JSX (safe mode, preserved)
 * ```ts
 * minifyInnerHTMLScript(`
 *   const App = () => <div>Hello</div>;
 * `, { enableJsx: true });
 * // => "const App=()=> <div>Hello</div>;"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * JSX (transform enabled)
 * ```ts
 * minifyInnerHTMLScript(`
 *   const App = () => <div>{console.log("test")}</div>;
 * `, { enableJsx: true });
 * // => "const App=()=>React.createElement(\"div\",null);"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * Async cleanup
 * ```ts
 * minifyInnerHTMLScript(`
 *   async function a(){
 *     await console.log("x");
 *   }
 * `);
 * // => "async function a(){}"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * Loop cleanup
 * ```ts
 * minifyInnerHTMLScript(`
 *   for(let i=0;i<3;i++){
 *     console.log(i);
 *   }
 * `);
 * // => "for(let i=0;i<3;i++);"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * Safe string handling
 * ```ts
 * minifyInnerHTMLScript(`
 *   const str = "console.log('hi')";
 * `);
 * // => "const str=\"console.log('hi')\";"
 * ```
 *
 * --------------------------------------------------------------------
 * @example
 * Invalid input fallback
 * ```ts
 * minifyInnerHTMLScript(null as any);
 * // => ""
 * ```
 */
export const minifyInnerHTMLScript = <T>(
  script: T,
  options: MinifyInnerHTMLScriptOptions = {}
): string => {
  if (!isNonEmptyString(script)) return "";

  const { typescriptOptions, enableJsx, ...restOptions } = options;

  const validTsrOption = sanitizeTerserOptions(restOptions);
  const validScrOption = sanitizeSucraseOptions(typescriptOptions);

  const userCompress =
    typeof validTsrOption?.compress === "object" ? validTsrOption.compress : {};

  const transforms: Transform[] = [
    "typescript",
    ...(enableJsx ? (["jsx"] as Transform[]) : []),
    ...(validScrOption.transforms?.filter(
      (t) => t !== "typescript" && t !== "jsx"
    ) ?? [])
  ];
  try {
    const compiled = transform(script, {
      ...validScrOption,
      transforms,
      production: true,
      disableESTransforms: true
    }).code;

    const result = minify_sync(compiled, {
      ...validTsrOption,

      compress: {
        drop_console: true,
        ...userCompress
      },
      mangle: validTsrOption?.mangle ?? true
    });

    return cleanupVoidAwait(result.code ?? "");
  } catch {
    return "";
  }
};

function sanitizeTerserOptions(
  input: MinifyInnerHTMLScriptOptions = {}
): TsrOptions {
  if (!input || typeof input !== "object") return {};

  const {
    compress,
    ecma,
    enclose,
    ie8,
    keep_classnames,
    keep_fnames,
    mangle,
    module,
    nameCache,
    format,
    parse,
    safari10,
    sourceMap,
    toplevel
  } = input;

  return {
    compress,
    mangle,
    ecma,
    enclose,
    ie8,
    keep_classnames,
    keep_fnames,
    module,
    nameCache,
    format,
    parse,
    safari10,
    sourceMap,
    toplevel
  };
}

function sanitizeSucraseOptions(
  input: Partial<ScrsOption> = {}
): Partial<ScrsOption> {
  if (!input || typeof input !== "object") return {};

  const {
    disableESTransforms,
    enableLegacyBabel5ModuleInterop,
    enableLegacyTypeScriptModuleInterop,
    filePath,
    injectCreateRequireForImportRequire,
    jsxFragmentPragma,
    jsxPragma,
    sourceMapOptions,
    transforms,
    jsxRuntime,
    jsxImportSource,
    production,
    preserveDynamicImport,
    keepUnusedImports
  } = input;

  const userTransforms = Array.isArray(transforms) ? transforms : [];

  return {
    disableESTransforms,
    enableLegacyBabel5ModuleInterop,
    enableLegacyTypeScriptModuleInterop,
    filePath,
    injectCreateRequireForImportRequire,
    jsxFragmentPragma,
    jsxPragma,
    sourceMapOptions,
    transforms: userTransforms,
    jsxRuntime,
    jsxImportSource,
    production,
    preserveDynamicImport,
    keepUnusedImports
  };
}

// /** -------------------------------------------------------------------
//  * * ***Minifies JavaScript code intended for inline `<script>` usage by
//  * aggressive stripping comments, unnecessary whitespace, and debug
//  * statements.***
//  * --------------------------------------------------------------------
//  *
//  * This function is designed for **simple script minification**, leveraging
//  * Babel's AST transformation to ensure structural integrity while
//  * performing aggressive cleanup.
//  *
//  * - **What it does:**
//  *      - Removes all `leading`, `trailing`, and `inner` comments.
//  *      - Collapses whitespace and tabs into a compact one-liner.
//  *      - **Comprehensively removes** all `console.*` statements (e.g., log,
//  *        error, warn) including optional chaining (`console?.log`) and
//  *        deeply nested calls (`window.console.log`).
//  *      - Cleans up `SequenceExpressions` and `TemplateLiterals` by
//  *        stripping out `void 0` and empty interpolation slots.
//  *      - Fixes redundant semicolons and edge-case `void` artifacts.
//  *
//  * - **What it does NOT guarantee:**
//  *      - Preservation of `console` usage even if shadowed by local variables
//  *        (it operates via identifier-based stripping).
//  *      - Compatibility with non-standard syntax not supported by the
//  *        configured Babel plugins (JSX/TypeScript are enabled).
//  *      - Intentional preservation of formatting inside template literals
//  *        if they contain stripped debug statements.
//  *
//  * This makes it best suited for **controlled, trusted inline scripts**
//  * such as small helpers injected into HTML where size and debug-cleanup
//  * are priorities.
//  *
//  * @param input - The JavaScript source to minify. If `null`, `undefined`,
//  * or not a string, an empty string is returned.
//  *
//  * @returns A minified JavaScript string safe to embed inside
//  * `<script>` tags.
//  *
//  * @example
//  * ```ts
//  * // Using a string literal
//  * minifyInnerHTMLScript(`
//  *    // Debug helper
//  *    const foo = 1 +  2;
//  *    console.log("Current value:", foo);
//  * `);
//  * // => "const foo=1+2;"
//  * ```
//  *
//  * @example
//  * ```ts
//  * // Handling template literals
//  * minifyInnerHTMLScript("const t = `Value: ${console.log('test'), 123}`;");
//  * // => "const t=`Value: ${123}`;"
//  * ```
//  */
// export function minifyInnerHTMLScript<T>(script: T): string {
//   if (isNil(script)) return "";

//   return (
//     String(script)
//       .replace(/\/\/.*(?=[\n\r])/g, "") // Remove single-line comments
//       .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
//       .replace(/(?<=\S)[ \t]{2,}(?=\S)/g, " ") // Remove extra spaces/tabs between words
//       // eslint-disable-next-line no-useless-escape
//       .replace(/\s*([\(\)\{\};,?:=<>!&|+\-*\/])\s*/g, "$1") // Remove spaces before & after operators and punctuation
//       .replace(/\[\s*([^\]]*?)\s*\]/g, "[$1]") // Remove spaces inside arrays without touching strings inside
//       .replace(/\s*(=>|===|!==|==|!=|>=|<=|\+|-|\*|\/|&&|\|\|)\s*/g, "$1") // Remove spaces around operators
//       .replace(
//         /\b(return|if|else|for|while|do|try|catch|finally|switch|case|default|break|continue|throw|typeof|instanceof|in|void|yield|async|await|new|delete|import|export|class|extends|static|get|set)\s+/g,
//         "$1 "
//       ) // Ensure one space after important keywords
//       .replace(/\b(var|let|const|function)\s+/g, "$1 ") // Ensure one space after variable & function declarations
//       .replace(/\b(\d+)\s+([a-zA-Z_$])/g, "$1$2") // Remove space between number and letter (e.g., 100 px -> 100px)
//       .replace(/([a-zA-Z_$])\s*\(\s*/g, "$1(") // Remove spaces before/after opening parentheses in function calls
//       .replace(/\)\s*\{\s*/g, "){") // Remove spaces before/after `{` following `)`
//       .replace(/([{[])\s*,/g, "$1") // Remove commas right after { or [
//       .replace(/,(\s*[}\]])/g, "$1") // Remove commas before } or ]
//       .replace(/(["'`])\s*\+\s*(["'`])/g, "$1$2") // Remove unnecessary `+` in string concatenation
//       .replace(/\bconsole\.assert\s*\(.*?\);?/g, "") // Remove all console.assert()
//       .replace(/\bconsole\.clear\s*\(.*?\);?/g, "") // Remove all console.clear()
//       .replace(/\bconsole\.log\s*\(.*?\);?/g, "") // Remove all console.log()
//       .replace(/\bconsole\.info\s*\(.*?\);?/g, "") // Remove all console.info()
//       .replace(/\bconsole\.warn\s*\(.*?\);?/g, "") // Remove all console.warn()
//       .replace(/\bconsole\.error\s*\(.*?\);?/g, "") // Remove all console.error()
//       .replace(/\bconsole\.debug\s*\(.*?\);?/g, "") // Remove all console.debug()
//       .replace(/\bconsole\.trace\s*\(.*?\);?/g, "") // Remove all console.trace()
//       .replace(/\bconsole\.table\s*\(.*?\);?/g, "") // Remove all console.table()
//       .replace(/\bconsole\.time\s*\(.*?\);?/g, "") // Remove all console.time()
//       .replace(/\bconsole\.timeEnd\s*\(.*?\);?/g, "") // Remove all console.timeEnd()
//       .replace(/\bconsole\.timeLog\s*\(.*?\);?/g, "") // Remove all console.timeLog()
//       .replace(/\bconsole\.count\s*\(.*?\);?/g, "") // Remove all console.count()
//       .replace(/\bconsole\.countReset\s*\(.*?\);?/g, "") // Remove all console.countReset()
//       .replace(/;}/g, "}") // Remove `;` before `}`
//       .replace(/\s{2,}/g, " ") // Remove remaining excessive spaces
//       .trim()
//   );
// }
