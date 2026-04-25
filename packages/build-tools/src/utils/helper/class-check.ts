/* eslint-disable @typescript-eslint/no-explicit-any */

/** -------------------------------------------------------
 * * ***Utility Type: `AnyConstructor`.***
 * -------------------------------------------------------
 *
 * Represents any constructable type (class or abstract class).
 *
 * This type matches values that can be invoked with `new`
 * and produce an instance of type `T`.
 *
 * - ***Behavior summary:***
 *       - Supports concrete classes.
 *       - Supports abstract classes.
 *       - Does NOT match non-constructable functions.
 *
 * ----------------------------------------------------------------
 *
 * @template T - The instance type produced by the constructor.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * class A {}
 * abstract class B {}
 *
 * type C1 = AnyConstructor<A>;
 * type C2 = AnyConstructor<B>;
 *
 * function create<T>(ctor: AnyConstructor<T>): T {
 *   return new ctor();
 * }
 * ```
 */
type AnyConstructor<T = any> = abstract new (...args: any[]) => T;

/** -------------------------------------------------------
 * * ***Utility Type: `ConcreteConstructor`.***
 * -------------------------------------------------------
 *
 * Represents a concrete constructable type (class constructor).
 *
 * This type matches values that can be invoked with `new`
 * and produce an instance of type `T`.
 *
 * - ***Behavior summary:***
 *       - Supports standard class constructors.
 *       - Does NOT include abstract constructors.
 *       - Does NOT match non-constructable functions.
 *
 * ----------------------------------------------------------------
 *
 * @template T - The instance type produced by the constructor.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * class A {}
 *
 * function create<T>(ctor: ConcreteConstructor<T>): T {
 *   return new ctor();
 * }
 * ```
 */
type ConcreteConstructor<T = any> = new (...args: any[]) => T;

/** ----------------------------------------------------------------
 * * ***Checks whether a value shares a prototype in its chain.***
 * ----------------------------------------------------------------
 *
 * Determines whether the prototype derived from `target`
 * exists anywhere within `value`'s prototype chain.
 *
 * This function performs a manual prototype-chain walk and
 * does NOT rely on native `instanceof`.
 *
 * - Ignores custom `Symbol.hasInstance` overrides.
 * - Uses strict reference equality (`===`) for comparison.
 * - Fully deterministic and unaffected by constructor property changes.
 *
 * ----------------------------------------------------------------
 * #### Supported Target Types:
 * ----------------------------------------------------------------
 * - Constructor functions ➔ uses `ctor.prototype`.
 * - Object instances      ➔ uses `Object.getPrototypeOf(target)`.
 *
 * If `target` itself has a null prototype
 * (e.g., `Object.create(null)`), the function returns `false`.
 *
 * ----------------------------------------------------------------
 * #### Important Behavior:
 * ----------------------------------------------------------------
 * - Primitive values (`string`, `number`, `boolean`, `symbol`,
 *   `bigint`, `null`, `undefined`) always return `false`.
 *
 * - Values with a null prototype (e.g., `Object.create(null)`)
 *   always return `false`.
 *
 * - Passing `{}` as `target` effectively checks for
 *   `Object.prototype` in the prototype chain.
 *
 * ----------------------------------------------------------------
 *
 * @param value  - The value whose prototype chain will be inspected.
 * @param target - A constructor or object whose derived prototype
 *                 will be searched for in `value`'s prototype chain.
 *
 * @returns `true` if the prototype derived from `target`
 * exists anywhere in `value`'s prototype chain.
 *
 * ----------------------------------------------------------------
 * @example
 * ```ts
 * class A {}
 * class B extends A {}
 *
 * const b = new B();
 *
 * hasSamePrototype(b, A);         // ➔ true
 * hasSamePrototype(b, new A());   // ➔ true
 * hasSamePrototype(b, URL);       // ➔ false
 * hasSamePrototype(b, new URL()); // ➔ false
 *
 * // Matches Object.prototype
 * hasSamePrototype(b, {});        // ➔ true
 *
 * // Null-prototype object
 * const nullObj = Object.create(null);
 * hasSamePrototype(nullObj, {});  // ➔ false
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @note
 * This check relies on strict prototype reference equality.
 *
 * Objects created in a different JavaScript realm
 * (e.g., iframe, VM context, worker) will NOT match,
 * even if they appear structurally identical.
 */
export function hasSamePrototype(
  value: unknown,
  target: object | AnyConstructor<any>
): boolean {
  //! Reject primitive values: prototype chains only exist on object-like entities
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  ) {
    return false;
  }

  //todo: Normalize target prototype reference:
  //? If function, use .prototype; if instance, use its direct prototype via Object.getPrototypeOf.
  const targetProto =
    typeof target === "function"
      ? target.prototype
      : Object.getPrototypeOf(target);

  //! Safety guard: If target has no prototype (e.g., Object.create(null)), match is impossible
  if (!targetProto) return false;

  //? Initial Step: Access the immediate prototype of the input value
  let proto = Object.getPrototypeOf(value);

  //todo: Traversal Loop: Walk the prototype chain until the end (null) is reached
  while (proto !== null) {
    //? Identity Match: Check if the current prototype in the chain strictly equals the target prototype
    if (proto === targetProto) return true;

    //todo: Link Propagation: Move upward to the next parent prototype in the inheritance hierarchy
    //todo: This effectively performs a manual recursive search without using the stack.
    proto = Object.getPrototypeOf(proto);
  }

  //? Termination: The entire chain was exhausted without finding a reference match
  return false;
}

/** ----------------------------------------------------------------
 * * ***Deterministic alternative to `instanceof`.***
 * ----------------------------------------------------------------
 *
 * Checks whether `ctor.prototype` exists anywhere in
 * `value`'s prototype chain.
 *
 * - ***Unlike native `instanceof`, this implementation:***
 *       - Does NOT use `instanceof`.
 *       - Ignores `Symbol.hasInstance`.
 *       - Cannot be affected by overriding Symbol.hasInstance.
 *
 * - ***Subclasses are allowed.***
 *
 * - Values with a null prototype (e.g., `Object.create(null)`) will
 * always return false.
 *
 * ----------------------------------------------------------------
 *
 * @param value - The value to test.
 * @param ctor - The constructor to compare against.
 *
 * @returns `true` if `value` is an instance of `ctor`
 * or any subclass of it.
 *
 * ----------------------------------------------------------------
 * @example
 * ```ts
 * class A extends Error {}
 * class B extends A {}
 *
 * const b = new B();
 *
 * isInstanceOf(b, A); // ➔ true
 * isInstanceOf(b, B); // ➔ true
 * isInstanceOf(b, Error); // ➔ true
 * isInstanceOf(b, URL); // ➔ false
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @note
 *  This check relies on strict prototype reference equality.
 *
 *  Objects created in a different JavaScript realm
 *  (e.g., iframe, VM context, worker) will NOT match,
 *  even if they appear structurally identical.
 */
export function isInstanceOf<T>(
  value: unknown,
  ctor: AnyConstructor<T>
): value is T {
  //! Constraint: Primitives do not have prototype chains and cannot be instances
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  ) {
    return false;
  }

  //? Initial Step: Access the immediate prototype of the instance
  let proto = Object.getPrototypeOf(value);

  //? Reference Point: Capture the constructor's prototype to search for in the chain also
  //? take for ensures check is unaffected by Symbol.hasInstance overrides
  const targetProto = ctor.prototype;

  //todo: Traversal Loop: Walk the prototype chain manually to bypass Symbol.hasInstance overrides
  while (proto !== null) {
    //? Identity Match: Check if any link in the chain strictly equals the constructor's prototype
    if (proto === targetProto) return true;

    //todo: Link Propagation: Move upward to the next parent prototype in the inheritance hierarchy
    //todo: This continues until a match is found or the chain terminates at null.
    proto = Object.getPrototypeOf(proto);
  }

  //? Termination: The target prototype was not found within the value's inheritance chain
  return false;
}

/** ----------------------------------------------------------------
 * * ***Checks whether one constructor extends another.***
 * ----------------------------------------------------------------
 *
 * Determines whether `child` inherits from `parent`
 * by walking the prototype chain of `child.prototype`.
 *
 * This implementation is deterministic and does NOT rely
 * on `instanceof`.
 *
 * ----------------------------------------------------------------
 *
 * @param child - The derived constructor.
 * @param parent - The base constructor.
 *
 * @returns `true` if `child` extends `parent`.
 *
 * A constructor is NOT considered a subclass of itself.
 *
 * ----------------------------------------------------------------
 * @example
 * ```ts
 * class A extends URL {}
 * class B extends A {}
 *
 * isSubclassOf(B, A); // ➔ true
 * isSubclassOf(B, URL); // ➔ true
 * isSubclassOf(A, B); // ➔ false
 * isSubclassOf(A, A); // ➔ false
 * isSubclassOf(B, B); // ➔ false
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @note
 *  This check relies on strict prototype reference equality.
 *
 *  Objects created in a different JavaScript realm
 *  (e.g., iframe, VM context, worker) will NOT match,
 *  even if they appear structurally identical.
 */
export function isSubclassOf<T, U>(
  child: AnyConstructor<T>,
  parent: AnyConstructor<U>
): boolean {
  //? Entry point: Start from the child constructor's prototype parent.
  //? This ensures a constructor is NOT considered a subclass of itself.
  let proto = Object.getPrototypeOf(child.prototype);

  //todo: Inheritance Traversal: Walk the prototype chain to find the parent's prototype.
  while (proto !== null) {
    //? Inheritance Match: Check if the parent's prototype is an ancestor of the child's prototype.
    if (proto === parent.prototype) return true;
    //todo: Link Propagation: Move upward to the next parent prototype in the inheritance hierarchy.
    //todo: This continues until a match is found or the chain terminates at null.
    proto = Object.getPrototypeOf(proto);
  }

  //? Termination: The parent prototype was not found in the child's inheritance chain.
  return false;
}

/** ----------------------------------------------------------------
 * * ***Checks for an exact constructor match.***
 * ----------------------------------------------------------------
 *
 * Determines whether `value` was created directly by `ctor`.
 *
 * - ***Unlike `isInstanceOf`, this function:***
 *       - Does NOT allow subclasses.
 *       - Requires the immediate prototype of `value`
 *         to strictly equal `ctor.prototype`.
 *
 * - ***This check is deterministic and immune to:***
 *       - `Symbol.hasInstance`.
 *       - `.constructor` property manipulation.
 *
 * Values with a null prototype (e.g., `Object.create(null)`) will
 * always return false.
 *
 * ----------------------------------------------------------------
 *
 * @param value - The value to test.
 * @param ctor - The constructor to match exactly.
 *
 * @returns `true` if `value` is an exact instance of `ctor`.
 *
 * ----------------------------------------------------------------
 * @example
 * ```ts
 * class A {}
 * class B extends A {}
 *
 * const b = new B();
 *
 * isExactInstanceOf(b, B); // ➔ true
 * isExactInstanceOf(b, A); // ➔ false
 *
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @note
 *  This check relies on strict prototype reference equality.
 *
 *  Objects created in a different JavaScript realm
 *  (e.g., iframe, VM context, worker) will NOT match,
 *  even if they appear structurally identical.
 */
export function isExactInstanceOf<T>(
  value: unknown,
  ctor: AnyConstructor<T>
): value is T {
  //! Constraint: Immediately reject primitives
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function")
  ) {
    return false;
  }

  //todo: Strict Direct Comparison: Verify if the immediate prototype is exactly the constructor's prototype.
  //todo: This effectively ignores parent classes in the chain, preventing subclass matches.
  return Object.getPrototypeOf(value) === ctor.prototype;
}

/** ----------------------------------------------------------------
 * * ***Checks whether a value is a class constructor.***
 * ----------------------------------------------------------------
 *
 * Determines whether the provided value is highly likely to be an
 * ES6 class constructor using multi-layer structural heuristics.
 *
 * - Uses `Function.prototype.toString` signature inspection.
 * - Validates prototype structural integrity.
 * - Supports native class constructors and standard class syntax.
 * ----------------------------------------------------------------
 * #### ⚠️ Important Behavior:
 * ----------------------------------------------------------------
 * - This function is a heuristic classifier, not a cryptographic or
 *   mathematically provable validator.
 *
 * - Runtime JavaScript does not provide a perfect mechanism to
 *   distinguish class constructors from function constructors.
 *
 * - Proxy-wrapped constructors or maliciously monkey-patched functions
 *   may bypass detection under adversarial environments.
 *
 * ----------------------------------------------------------------
 * #### Supported Class Forms:
 * ----------------------------------------------------------------
 * - Native ES6 class syntax:
 *   ```ts
 *      class A {}
 *   ```
 *
 * - Native built-in constructors:
 *    - `Map`.
 *    - `Set`.
 *    - `Error`.
 *    - `Promise`.
 *
 * - Transpiled class outputs (if structural signals remain intact).
 *
 * ----------------------------------------------------------------
 *
 * #### Detection Strategy Summary:
 *
 * - Checks function construct-ability.
 * - Inspects source signature via `Function.prototype.toString`.
 * - Validates prototype linkage consistency.
 * - Ensures constructor reflexive integrity.
 * - Verifies prototype descriptor identity.
 *
 * ----------------------------------------------------------------
 *
 * @param value - The value to be tested.
 *
 * @returns `true` if the value is likely a class constructor.
 *
 * ----------------------------------------------------------------
 *
 * @example
 * ```ts
 * class A {}
 * function B() {}
 *
 * isClass(A); // ➔ true
 * isClass(B); // ➔ false
 *
 * const arr = Array;
 * isClass(arr); // ➔ true (native constructor)
 * ```
 *
 * ----------------------------------------------------------------
 *
 * @note
 *
 * This function is intended for runtime utility validation and should
 * not be used as the sole security boundary in adversarial systems.
 *
 * Objects created in different JavaScript realms (e.g., iframe,
 * worker, VM context) may not be detected even if structurally similar.
 */
//? Overload 1: Preserve original type when variable type is already known
export function isClass<T>(value: T): value is T & ConcreteConstructor;
//? Overload 2: For unknown/any input type
export function isClass(value: unknown): value is ConcreteConstructor;
//? Implementation
export function isClass(value: unknown): boolean {
  //! Requirement: Must be a function to even be a candidate for a constructor
  if (typeof value !== "function") return false;

  let fnStr: string;

  //todo: Source Acquisition: Safely obtain the function's source code representation
  try {
    fnStr = Function.prototype.toString.call(value);
  } catch {
    //! Safety Guard: If toString fails (e.g. on certain Proxy types), reject immediately
    return false;
  }

  //? Signature Detection: Look for explicit 'class' keyword or engine-level native signatures also
  //? detect ES6 class syntax or native constructor signature
  const isClassSyntax = /^class[\s{]/.test(fnStr);
  const isNative = fnStr.includes("[native code]");

  //! Logic Boundary: If it lacks both ES6 class syntax and native constructor markers, reject as regular function
  //! also Reject ordinary functions that are not constructable class-like entities
  if (!isClassSyntax && !isNative) return false;

  //? Integrity Check: Every constructor must have a valid prototype object linkage
  const proto = value.prototype;

  //! Validity constructor must have valid prototype object
  if (!proto || typeof proto !== "object") return false;

  try {
    //todo - Reflexive Integrity: Ensure the prototype has a 'constructor' property pointing back to itself
    if (!Object.prototype.hasOwnProperty.call(proto, "constructor"))
      return false;

    //! Identity Verification: The back-reference must strictly equal the original function
    if (proto.constructor !== value) return false;
  } catch {
    //! Panic Guard: Catch errors from potential 'poisoned' prototypes or proxy traps
    return false;
  }

  //? Descriptor Validation: Retrieve the underlying property configuration for 'prototype' and structural integrity
  const descriptor = Object.getOwnPropertyDescriptor(value, "prototype");

  //! Reference Matching: Ensure the descriptor's value is the exact same object as the prototype link
  if (!descriptor || descriptor.value !== proto) return false;

  //! NOTE:
  //! Native class constructors (e.g. Map, Set, Promise, Error)
  //! may have non-writable prototype properties.
  //!
  //! Therefore, checking descriptor.value identity is sufficient
  //! to confirm structural integrity without enforcing write-ability.
  return true;
}
