import { source } from "@/lib/source";
import { DocsLayout } from "@/layouts/notebook";
import { baseOptions } from "@/lib/layout.shared";
import AiSearchProvider from "@/providers/fumadocs/ai-search";
import SidebarBannerToggle from "@/components/toggle/sidebar-banner";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const { nav, ...base } = baseOptions();

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...base}
      links={[]}
      nav={{
        ...nav,
        transparentMode: "always",
        mode: "top"
        // url: SOURCE_CONFIG.LOADER.BASE_URL
      }}
      // tabMode="navbar"
      sidebar={{
        tabs: false,
        collapsible: false,
        prefetch: "onHover",
        banner: <SidebarBannerToggle />
      }}
    >
      <AiSearchProvider />
      {children}
    </DocsLayout>
  );
}
