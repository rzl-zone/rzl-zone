import { isFunction } from "@rzl-zone/utils-js/predicates";

export class ActionError extends Error {
  public code: string;
  override name = "ActionError";

  constructor(code: string, message: string) {
    super(message);
    this.code = code;

    // Preserve stack trace when available (Node.js & modern browsers).
    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, ActionError);
    } else {
      // Fallback for very old environments.
      this.stack = new Error(message).stack;
    }
  }

  toJSON(): ActionErrorJson {
    return {
      code: this.code,
      message: this.message,
      stack: this.stack
    };
  }
}

export interface ActionErrorJson {
  code: string;
  message: string;
  stack: string | undefined;
}
