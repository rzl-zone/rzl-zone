export type IsHasKeysObject<T> = keyof T extends never ? false : true;
