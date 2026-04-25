import semver from "semver";
import { redirect } from "next/navigation";

import { getCachedDocs } from "@/utils/fumadocs";

export async function redirectLatestVersion(slug: string[] | undefined) {
  const packages = await getCachedDocs();

  const [pkgName, maybeVersion, ...rest] = slug || [];
  const encodeMaybeVersion = maybeVersion && decodeURIComponent(maybeVersion);

  if (pkgName) {
    const matched = packages.find((pkg) => pkg.slug === pkgName);

    if (matched) {
      const isValidVersion =
        maybeVersion && matched.versions.includes(maybeVersion);
      const restSlug = rest.length > 0 ? "/" + [...rest].join("/") : "";
      // "/docs/<package-name>/@latest/..." ➔ redirect to real version
      if (encodeMaybeVersion === "@latest") {
        redirect(`/docs/${pkgName}/${restSlug}`);
      }
      // "/docs/<package-name>/requirements" ➔ add latest add mid
      if (!encodeMaybeVersion && rest.length > 0) {
        redirect(`/docs/${pkgName}/${restSlug}`);
      }
      // "/docs/<package-name>/<invalid>" or with rest slug ➔ also redirect to latest
      if (
        encodeMaybeVersion &&
        semver.parse(maybeVersion, false, false)?.version &&
        !isValidVersion
      ) {
        redirect(`/docs/${pkgName}/${restSlug}`);
      }
    }
  }
}
