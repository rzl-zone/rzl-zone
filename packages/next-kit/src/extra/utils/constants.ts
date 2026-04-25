const determineLastDot = (message: string) => {
  return `${message.endsWith(".") ? message.trim() : message.trim() + "."}`;
};

/** @internal */
export const RZL_NEXT_KIT_EXTRA = {
  NAME: "RZL_NEXT_KIT_EXTRA (Extra)",
  ERROR: {
    PROPS_MESSAGE: (message: string) => {
      return `[${RZL_NEXT_KIT_EXTRA.NAME} - Error]: ${determineLastDot(message)}`;
    },
    FLAG_MESSAGE: (message: string) => {
      return `[${RZL_NEXT_KIT_EXTRA.NAME} - Error]: ${determineLastDot(message)} \nThis may happen if you're using '--turbo' or '--turbopack', which is currently not supported by '@rzl-zone/next-kit'. \n\nPlease run without the turbo flag.`;
    }
  }
} as const;
