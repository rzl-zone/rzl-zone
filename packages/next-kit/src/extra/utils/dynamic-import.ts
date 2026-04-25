/* eslint-disable @typescript-eslint/no-unused-vars */
/** @internal */
export function safeImport<T = object>(path: string): T | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(path);
  } catch (_) {
    return;
  }
}
