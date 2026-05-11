import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";

import { DocsLayout } from "@/layouts/notebook";

import SidebarBannerToggle from "@/components/toggle/sidebar-banner";
import { SOURCE_CONFIG } from "@/configs/source/package";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const { nav, ...base } = baseOptions();

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      links={[]}
      nav={{
        ...nav,
        mode: "top",
        transparentMode: "always",
        url: SOURCE_CONFIG.LOADER.BASE_URL
      }}
      sidebar={{
        tabs: false,
        collapsible: false,
        banner: <SidebarBannerToggle />
      }}
    >
      {children}
    </DocsLayout>
  );
}
