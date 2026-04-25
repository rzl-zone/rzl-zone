export {};

declare global {
  interface ImportMeta {
    env?: {
      MODE?: string;
      NODE_ENV?: string;
    };
  }
}
