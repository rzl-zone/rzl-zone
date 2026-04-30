import type { AnyString, Prettify } from "@rzl-zone/ts-types-plus";

import semver from "semver";
import {
  isFunction,
  isNonEmptyArray,
  isNonEmptyString,
  isPlainObject
} from "@rzl-zone/utils-js/predicates";
import { normalizePathname } from "@rzl-zone/utils-js/urls";
import { capitalizeFirst } from "@rzl-zone/utils-js/strings";

import { type CachedDoc } from "@/utils/fumadocs";
import { PACKAGES_CONFIGS } from "@/configs/packages/docs";

// helper
const CHANNEL_ORDER = ["canary", "dev", "alpha", "beta", "rc"] as const;
const TAG_LABEL_MAP: Record<string, string> = {
  alpha: "Alpha",
  beta: "Beta",
  rc: "RC",
  dev: "Dev",
  canary: "Canary",
  nightly: "Nightly",
  experimental: "Experimental"
};
const isChannel = (v: string, order: readonly string[]): boolean => {
  return isNonEmptyString(v) && isNonEmptyArray(order) && order.includes(v);
};
const formatVersionLabel = (vers: string) => {
  // latest
  if (vers === "latest") return "Latest Version";

  const parsed = semver.parse(vers);

  if (parsed) {
    // const base = parsed.version;

    // prerelease
    if (parsed.prerelease.length > 0) {
      const [rawTag, rawNum] = parsed.prerelease;

      const tag = String(rawTag).toLowerCase();
      const label = TAG_LABEL_MAP[tag] ?? capitalizeFirst(tag, { trim: true });

      if (rawNum !== undefined && rawNum !== "0" && rawNum !== 0) {
        return `${label} Version ${rawNum}`;
      }

      return `${label} Version`;
    }

    // stable → show major
    return `Version ${parsed.major.toString()}`;
  }

  // v1 → 1
  if (/^v\d+$/.test(vers)) return `Version ${vers.slice(1)}`;

  // 2.x → 2
  if (/^\d+\.x$/.test(vers) && vers.split(".")[0]) {
    return `Version ${vers.split(".")[0]!}`;
  }

  // channel (beta, rc)
  if (TAG_LABEL_MAP[vers]) return `${TAG_LABEL_MAP[vers]} Version`;

  return vers;
};

type VersionItem = {
  raw: string;
  type: "latest" | "stable" | "prerelease" | "major" | "channel" | "unknown";
  label: string;
  group?: string;
  channel?: AnyString | VersionItem["type"]; // beta, rc, etc
};

export const getSortedVersions = (
  pkg: CachedDoc,
  options: {
    /**
     * @default true
     */
    appendLatest?: boolean;
    /**
     * @default ["canary", "dev", "alpha", "beta", "rc"]
     */
    channelOrder?: string[];
  } = {}
) => {
  if (!isPlainObject(options)) options = {};
  const { appendLatest = true, channelOrder = CHANNEL_ORDER } = options;

  // dedupe + clone
  const versions = Array.from(new Set(pkg.versions));

  const hasLatest = versions.includes("latest");
  const MAJOR_X_REGEX = /^v?\d+(?:\.x)?$/;

  // 1. remove "latest"
  const filtered = versions.filter((v) => v !== "latest");

  // 2. buckets
  const stable: string[] = [];
  const prerelease: string[] = [];
  const major: string[] = [];
  const channels: string[] = [];
  const unknown: string[] = [];

  for (const v of filtered) {
    // channel (beta, rc, etc)
    if (isChannel(v, channelOrder)) {
      channels.push(v);
      continue;
    }

    // semver
    if (semver.valid(v)) {
      if (semver.prerelease(v)) {
        prerelease.push(v);
      } else {
        stable.push(v);
      }
      continue;
    }

    // major-only (v1, 2.x)
    if (MAJOR_X_REGEX.test(v)) {
      major.push(v);
      continue;
    }

    // fallback
    unknown.push(v);
  }

  // 3. sorting

  // stable (highest first)
  const sortedStable = semver.rsort(stable);

  // prerelease (still semver sorted)
  const sortedPrerelease = semver.rsort(prerelease);

  // major (v3 > v2 > v1)
  const sortedMajor = major.sort((a, b) => {
    const getNum = (v: string) => Number(v.replace(/^v?(\d+)(?:\.x)?$/, "$1"));
    return getNum(b) - getNum(a);
  });

  // channel (based on priority)
  const sortedChannels = channels.sort(
    (a, b) =>
      (channelOrder as readonly string[]).indexOf(a) -
      (channelOrder as readonly string[]).indexOf(b)
  );

  // unknown (keep stable order but push last)
  const sortedUnknown = unknown;

  // 4. merge (final priority order)
  const finalVersions = [
    ...(hasLatest && appendLatest ? ["latest"] : []),
    ...sortedStable,
    ...sortedPrerelease,
    ...sortedMajor,
    ...sortedChannels,
    ...sortedUnknown
  ];

  const mapToItem = (v: string): VersionItem => {
    if (v === "latest") {
      return {
        raw: pkg.actualVersionLatest[v] ?? "latest",
        type: "latest",
        label: formatVersionLabel(v)
      };
    }

    if ((channelOrder as readonly string[]).includes(v)) {
      return {
        raw: v,
        type: "channel",
        label: formatVersionLabel(v),
        channel: v
      };
    }

    if (semver.valid(v)) {
      const parsed = semver.parse(v)!;

      if (parsed.prerelease.length > 0) {
        const [tag] = parsed.prerelease;

        return {
          raw: v,
          type: "prerelease",
          label: formatVersionLabel(v),
          channel: tag ? String(tag) : undefined
        };
      }

      return {
        raw: v,
        type: "stable",
        label: formatVersionLabel(v)
      };
    }

    if (MAJOR_X_REGEX.test(v)) {
      return {
        raw: v,
        type: "major",
        label: formatVersionLabel(v)
      };
    }

    return {
      raw: v,
      type: "unknown",
      label: v
    };
  };

  return {
    versions: finalVersions.map(mapToItem),
    name: pkg.name ?? null
  };
};

type VersionGroup = {
  major: string;
  label: string;
  latest: VersionItem;
  versions: VersionItem[];
};

export const getGroupedVersions = (pkg: CachedDoc) => {
  const { versions } = getSortedVersions(pkg);

  const groups = new Map<string, VersionGroup>();
  const others: VersionItem[] = [];
  let latest: VersionItem | null = null;

  for (const v of versions) {
    if (v.type === "latest") {
      latest = v;
      continue;
    }

    if (v.type === "prerelease" || v.type === "channel") {
      others.push(v);
      continue;
    }

    let majorKey: string | null = null;

    if (v.type === "major") {
      majorKey = v.label;
    } else if (v.type === "stable") {
      const parsed = semver.parse(v.raw);
      if (parsed) {
        majorKey = String(parsed.major);
      }
    }

    if (!majorKey) {
      others.push(v);
      continue;
    }

    if (!groups.has(majorKey)) {
      groups.set(majorKey, {
        major: majorKey,
        label: `Version ${majorKey}`,
        versions: [],
        latest: v
      });
    }

    groups.get(majorKey)!.versions.push(v);
  }

  for (const group of groups.values()) {
    group.versions.sort((a, b) => {
      if (semver.valid(a.raw) && semver.valid(b.raw)) {
        return semver.rcompare(a.raw, b.raw);
      }
      return 0;
    });

    const stable = group.versions.find((v) => v.type === "stable");
    if (stable) {
      group.latest = stable;
    }
  }

  return {
    latest,
    groups: Array.from(groups.values()).sort(
      (a, b) => Number(b.major) - Number(a.major)
    ),
    others
  };
};

export function getLinkUrl(params: {
  packageName: string;
  toPath: string;
  version?: string;
}) {
  const packageName = normalizePathname(params.packageName);
  const version = normalizePathname(params.version, {
    ignoreDomainExtensions: [".x"]
  });
  const toPath = normalizePathname(params.toPath);

  const directPath = isNonEmptyString(version) ? version + toPath : toPath;

  return normalizePathname(
    PACKAGES_CONFIGS.URL_DOCS + packageName + directPath
  );
}

export type PackagesName = "build-tools" | "utils-js" | "next-kit";

export type PackageData = {
  name: string;
  githubUrl?: string;
  description?: string;
  actualVersionLatest: Record<string, string>;
  url: (toPath: string, version?: string) => string;
};

export type PackagesConfigs = Prettify<
  {
    URL_DOCS: string;
  } & Record<PackagesName, PackageData>
>;

export const getHrefPackage = (
  packageName: PackagesName,
  toPath: string,
  version?: string
) => {
  const configPkg = getPackageData(packageName);

  if (configPkg && isFunction(configPkg.url)) {
    return configPkg.url(toPath, version);
  }

  return PACKAGES_CONFIGS.URL_DOCS;
};

type ValidPackageName = Exclude<keyof typeof PACKAGES_CONFIGS, "URL_DOCS">;

export const isValidPackageName = (
  packageName?: string | null
): packageName is ValidPackageName => {
  return (
    isNonEmptyString(packageName) &&
    packageName !== "URL_DOCS" &&
    packageName in PACKAGES_CONFIGS
  );
};

export const getPackageData = (
  packageName?: string | null
): PackageData | undefined => {
  if (isValidPackageName(packageName)) return PACKAGES_CONFIGS[packageName];
};
