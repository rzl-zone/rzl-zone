declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?:
      | "development"
      | "production"
      | "test"
      | "staging"
      | "preview"
      | "qa"
      | ({} & string);
  }
}
