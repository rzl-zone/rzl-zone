import { isArray } from "@rzl-zone/utils-js/predicates";

// import { getSortedVersions } from "./docs";
import { getCachedDocs } from "../fumadocs";
import { getSortedVersions } from "./docs";

export type TagsOptions = (
  | { label: string; value: string | "__all__" | -1 }
  | undefined
)[];

export const SEARCH_TAGS: () => Promise<TagsOptions> = async () => {
  const dataPackage = await getCachedDocs();

  if (!isArray(dataPackage)) return [];

  const base = dataPackage
    // Sort package name
    .slice()
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
    // Flat map make for list tags
    .flatMap((pkg) => {
      const { versions, name: pkgName } = getSortedVersions(pkg);

      return [
        pkgName ? { label: pkgName, value: pkg.slug ?? -1 } : undefined,
        ...versions
          .filter((v) => v.type !== "latest")
          .map((version) =>
            pkgName
              ? ({
                  label: `${pkgName} – Version ${version}`,
                  value: `${pkg.slug}_${version}`
                } satisfies TagsOptions[number])
              : undefined
          )
      ] satisfies TagsOptions;
    });
  return base;
};
