import { cn } from "@rzl-zone/docs-ui/utils";
import { SeparatorSection } from "@rzl-zone/docs-ui/components/separator";

import { env } from "@/utils/env";

const FooterPage = () => {
  const currentYear = new Date().getFullYear();
  const releaseYear = env.NEXT_PUBLIC_APP_RELEASE;

  const copyRightYear =
    currentYear === releaseYear ? currentYear : `${releaseYear}-${currentYear}`;

  return (
    <footer className={cn("mt-0")}>
      <SeparatorSection className="my-0" />
      <div
        className={cn(
          "text-fd-secondary-foreground/80 text-md leading-4.5",
          "mx-auto",
          "px-4",
          "mt-2 mb-1.5",
          "flex flex-col gap-0 items-center justify-center"
        )}
      >
        <span>
          © {copyRightYear} {env.NEXT_PUBLIC_APP_POWERED_BY}.
        </span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
};

export default FooterPage;
