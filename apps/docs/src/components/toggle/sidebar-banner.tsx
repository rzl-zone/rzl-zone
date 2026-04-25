import { use } from "react";
import { normalizePathname } from "@rzl-zone/utils-js/urls";

import { SOURCE_CONFIG } from "@/configs/source/package";

import {
  type OptionSideBarNavToggle,
  SidebarNavToggle,
  type SidebarNavToggleOptions
} from "@/components/toggle/sidebar-nav";

import { getCachedDocs } from "@/utils/fumadocs";
import { getGroupedVersions } from "@/utils/packages/docs";

const SidebarBannerToggle = () => {
  const dataPackage = use(getCachedDocs());

  return (
    <>
      {/* Packages Control */}
      <SidebarNavToggle
        typeControl="packages"
        tabIndex={-1}
        options={[
          {
            title: <span className="font-semibold">Homepage</span>,
            url: SOURCE_CONFIG.LOADER.BASE_URL
          },
          ...dataPackage.map((pkg) => {
            return {
              url: normalizePathname(
                `${SOURCE_CONFIG.LOADER.BASE_URL}/${pkg.slug}`
              ),
              disableNavIfToPath: new Set([`${pkg.slug}/*`]),
              title: <span className="font-semibold">{pkg.name}</span>,
              description: (
                <span className="font-semibold">{pkg.description}</span>
              )
            } satisfies OptionSideBarNavToggle;
          })
        ]}
      />

      {/* Versions Control */}
      {dataPackage.map((pkg) => {
        const grouped = getGroupedVersions(pkg);

        return (
          <SidebarNavToggle
            typeControl="versions"
            tabIndex={-1}
            key={pkg.slug}
            options={[
              // Latest
              ...(grouped.latest
                ? ([
                    {
                      title: (
                        <div>
                          <div className="font-semibold">
                            {grouped.latest.label}
                          </div>
                        </div>
                      ),
                      url: `${SOURCE_CONFIG.LOADER.BASE_URL}/${pkg.slug}`,
                      disableNavIfToPath: `${pkg.slug}/*`,
                      description: (
                        <div className="font-semibold">
                          {grouped.latest.raw}
                        </div>
                      )
                    }
                  ] satisfies SidebarNavToggleOptions[])
                : []),

              // Major
              ...grouped.groups
                .filter((g) => g.latest !== null)
                .map<SidebarNavToggleOptions>((group) => {
                  const vers = group.latest;
                  const isLatest = vers.type === "latest";

                  return {
                    title: (
                      <div>
                        <div className="font-semibold">{group.label}</div>
                      </div>
                    ),
                    disableNavIfToPath: isLatest
                      ? `${pkg.slug}/*`
                      : `${pkg.slug}/${vers.raw}/*`,
                    url: isLatest
                      ? `${SOURCE_CONFIG.LOADER.BASE_URL}/${pkg.slug}`
                      : `${SOURCE_CONFIG.LOADER.BASE_URL}/${pkg.slug}/${vers.raw}`,
                    description: <div className="font-semibold">{vers.raw}</div>
                  };
                }),

              // Others
              ...grouped.others.map<SidebarNavToggleOptions>((vers) => ({
                title: (
                  <div>
                    <div className="font-semibold">{vers.label}</div>
                  </div>
                ),
                url: `${SOURCE_CONFIG.LOADER.BASE_URL}/${pkg.slug}/${vers.raw}`,
                description: <div className="font-semibold">{vers.raw}</div>
              }))
            ]}
          />
        );
      })}
    </>
  );
};

export default SidebarBannerToggle;
