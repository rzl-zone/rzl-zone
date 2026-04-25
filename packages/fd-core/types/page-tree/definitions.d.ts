import "fumadocs-core/page-tree";

declare module "fumadocs-core/page-tree" {
  interface INode {
    /**
     * ID for the node, unique in all page trees (even across different locales)
     */
    $id?: string;
  }

  interface Item extends INode {
    /**
     * @internal
     */
    $ref?: {
      file: string;
    };
    type: "page";
    name: React.ReactNode;
    nameAlias?: string;
    url: string;
    /**
     * Whether the link should be treated as external (e.g. use HTML <a> tag).
     *
     * When unspecified, it depends on the value of `url`.
     */
    external?: boolean;
    description?: React.ReactNode;
    icon?: React.ReactNode;
  }
}
