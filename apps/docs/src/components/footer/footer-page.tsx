import { SeparatorSection } from "@rzl-zone/docs-ui/components/separator";

import { cn } from "@/lib/cn";
import { env } from "@/utils/env";

const FooterPage = () => {
  const currentYear = new Date().getFullYear();
  const releaseYear = env.NEXT_PUBLIC_APP_RELEASE;

  const copyRightYear =
    currentYear === releaseYear ? currentYear : `${releaseYear}-${currentYear}`;

  return (
    <div className={cn("mt-4")}>
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
    </div>
  );
};

export default FooterPage;
