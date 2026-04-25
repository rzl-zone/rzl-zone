import { type ComponentPropsWithoutRef, type ReactNode } from "react";

import { isString } from "@rzl-zone/utils-js/predicates";

import { ItemTypeTableClientList } from "@/components/type-table/item-client-list";
import {
  renderMarkdownDefault,
  renderTypeDefault
} from "@/auto-type/auto-type-table";

export interface ParameterNode {
  name?: string;
  description?: ReactNode;
}

export interface TypeNode {
  /**
   * Additional description of the field
   */
  description?: ReactNode;

  /**
   * type signature (short)
   */
  type: ReactNode;

  /**
   * type signature (full)
   */
  typeDescription?: ReactNode;

  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string;

  default?: ReactNode;

  required?: boolean;
  deprecated?: boolean;

  parameters?: ParameterNode[];

  returns?: ReactNode;
}

export async function TypeTableCustom({
  type,
  allowMultiple = false,
  renderType = renderTypeDefault,
  textParam = "Param",
  textType = "Type"
}: {
  type: Record<string, TypeNode>;
  textParam?: string;
  textType?: string;
  renderType?: typeof renderTypeDefault;
  /** @deprecated Still useless */
  renderMarkdown?: typeof renderMarkdownDefault;
} & Pick<
  ComponentPropsWithoutRef<typeof ItemTypeTableClientList>,
  "allowMultiple"
>) {
  const entries = Object.entries(type);

  // Resolve all of renderType async, change to [string, TypeNode]
  const resolvedItems = await Promise.all(
    entries.map(async ([key, value]) => {
      const typeDescriptionFormatted: ReactNode = isString(
        value.typeDescription
      )
        ? await renderType(value.typeDescription)
        : value.typeDescription;

      return [key, { ...value, typeDescription: typeDescriptionFormatted }] as [
        string,
        TypeNode
      ];
    })
  );

  return (
    <div className="@container flex flex-col p-1 bg-fd-card text-fd-card-foreground rounded-2xl border my-6 text-sm overflow-hidden">
      <div className="flex font-semibold items-center px-3 py-1 not-prose text-fd-muted-foreground">
        <p className="w-[25%]">{textParam}</p>
        <p className="@max-xl:hidden">{textType}</p>
      </div>

      <ItemTypeTableClientList
        items={resolvedItems}
        allowMultiple={allowMultiple}
      />
    </div>
  );
}
