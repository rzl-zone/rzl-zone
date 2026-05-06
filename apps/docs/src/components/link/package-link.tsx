import type { FC } from "react";
import type { OmitStrict } from "@rzl-zone/ts-types-plus";
import { getHrefPackage, type PackagesName } from "@/utils/packages/docs";

import { CustomNextLink, type CustomNextLinkType } from ".";

type PackageLinkProps = OmitStrict<
  CustomNextLinkType,
  "href" | "passHref" | "as"
> & {
  /**
   * Package Name
   */
  packageName: PackagesName;
  /**
   * Pathname on package name route
   */
  toPath: string;
  /**
   * version on selected package route
   */
  version?: string;
};

export const PackageLink: FC<PackageLinkProps> = ({
  packageName,
  toPath,
  version,
  ...props
}) => {
  return (
    <CustomNextLink
      {...props}
      href={getHrefPackage(packageName, toPath, version)}
    />
  );
};
