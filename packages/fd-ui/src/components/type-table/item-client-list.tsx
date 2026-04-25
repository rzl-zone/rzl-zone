"use client";

import { useState } from "react";

import type { TypeNode } from "./index";
import { ItemTypeTableClient } from "./client";

/** Renders a list of collapsible type table items.
 *
 * Each item represents a property or field of a `TypeNode`.
 * By default, only one item can be expanded at a time, but this behavior
 * can be changed using the `allowMultiple` option.
 *
 * @example
 * ```tsx
 * <ItemTypeTableClientList
 *   items={[
 *     ["propA", { type: "string", description: "Example property" }],
 *     ["propB", { type: "number", required: true }],
 *   ]}
 *   allowMultiple
 * />
 * ```
 *
 * @param props - The component props.
 * @param props.items - Array of key–value tuples where the key is the field name and the value is a `TypeNode`.
 * @param props.allowMultiple - If `true`, multiple items can be expanded at once.
 *                              If `false` (default), only one item can be open at a time.
 *
 * @returns The rendered list of collapsible type items.
 */
export function ItemTypeTableClientList({
  items,
  allowMultiple = false
}: {
  /**
   * Array of `[key, TypeNode]` tuples representing each collapsible item.
   *
   * The `key` is the unique name of the field, and the `TypeNode`
   * contains its metadata (type, description, parameters, etc.).
   *
   * @example
   * ```tsx
   * items={[
   *   ["id", { type: "number", required: true }],
   *   ["name", { type: "string", description: "User name" }],
   * ]}
   * ```
   */
  items: [string, TypeNode][];
  /**
   * Determines whether multiple items can be open at the same time.
   *
   * - If `true`: multiple sections can be expanded simultaneously.
   * - If `false`: only one section stays open at a time (default).
   *
   * @default false
   */
  allowMultiple?: boolean;
}) {
  /** Tracks which item keys are currently open. */
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  /**
   * Handles when an item's open state changes.
   *
   * @param key - The unique key of the item.
   * @param isOpen - Whether the item is being opened or closed.
   */
  const handleOpenChange = (key: string, isOpen: boolean) => {
    setOpenKeys((prev) => {
      if (allowMultiple) {
        return isOpen ? [...prev, key] : prev.filter((k) => k !== key);
      } else {
        return isOpen ? [key] : [];
      }
    });
  };

  return (
    <>
      {items.map(([key, value]) => (
        <ItemTypeTableClient
          key={key}
          name={key}
          item={value}
          open={openKeys.includes(key)}
          onOpenChange={(isOpen) => handleOpenChange(key, isOpen)}
        />
      ))}
    </>
  );
}
