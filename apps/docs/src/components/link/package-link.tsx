import { getHrefPackage, type PackagesName } from "@/utils/packages/docs";
import { FumaNextLink, type FumaNextLinkType } from ".";
import type { OmitStrict } from "@rzl-zone/ts-types-plus";

type PackageLinkProps = OmitStrict<
  FumaNextLinkType,
  "href" | "passHref" | "as"
> & {
  packageName: PackagesName;
  toPath: string;
  version?: string;
};

export function PackageLink({
  packageName,
  toPath,
  version,
  ...props
}: PackageLinkProps) {
  return (
    <FumaNextLink
      {...props}
      href={getHrefPackage(packageName, toPath, version)}
    />
  );
}
