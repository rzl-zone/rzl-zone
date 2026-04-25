import {
  getPreciseType,
  isNonEmptyString,
  isServer
} from "@rzl-zone/utils-js/predicates";

/** -------------------------------------------------------------------
 * * ***Creates a standardized `TypeError` for invalid React component props.***
 * --------------------------------------------------------------------
 *
 * This helper is intended to provide clear and consistent error messages
 * when a component receives a prop with an unexpected type.
 *
 * The error message includes:
 * - The prop key name
 * - The expected type description
 * - The actual runtime type (using `getPreciseType`)
 * - The component name
 * - Optional current pathname (useful for routing-based apps)
 * - A browser-only hint to check the console stack trace
 *
 * @param args - Configuration object for the prop type error.
 * @param args.key - The name of the invalid prop.
 * @param args.expected - A human-readable description of the expected type.
 * @param args.actualInput - The actual value received by the prop.
 * @param args.component - The name of the component receiving the prop.
 * @param args.currentPathname - Optional current route pathname where the error occurred.
 *
 * @returns A `TypeError` instance with a descriptive error message.
 *
 * @example
 * ```ts
 * throw createPropTypeError({
 *   key: "size",
 *   expected: "string",
 *   actualInput: 123,
 *   component: "Button",
 *   currentPathname: "/dashboard"
 * });
 * ```
 */
export function createPropTypeError(args: {
  key: string;
  expected: string;
  actualInput: unknown;
  component: string;
  currentPathname?: string;
}) {
  const { actualInput, component, expected, key, currentPathname } = args;
  const theCurrentPathname = isNonEmptyString(currentPathname)
    ? ` in path page \`${currentPathname}\``
    : "";

  return new TypeError(
    `Invalid prop type: The prop \`${key}\` expects a ${expected}  \`<${component} />\`${theCurrentPathname}, but received: \`${getPreciseType(
      actualInput
    )}\`.` +
      (!isServer()
        ? "\nOpen your browser's console to view the Component stack trace."
        : "")
  );
}

/** -------------------------------------------------------------------
 * * ***An `Error` subclass that guarantees a captured stack trace
 * when supported by the JavaScript runtime.***
 * --------------------------------------------------------------------
 *
 * This is useful when you want more predictable stack traces,
 * especially in Node.js environments where `Error.captureStackTrace`
 * is available.
 *
 * The error name is explicitly set to `"ErrorWithStack"`.
 *
 * @example
 * ```ts
 * throw new ErrorWithStack("Something went wrong");
 * ```
 */
export class ErrorWithStack extends Error {
  constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorWithStack);
    }

    this.name = "ErrorWithStack";
  }
}
