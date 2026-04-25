import React from "react";

import { cn } from "@rzl-zone/docs-ui/utils";
import { env } from "@/utils/env";

const MadeBy = (props?: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      {...props}
      className={cn("font-semibold -my-2.25", props?.className)}
    >
      <span>Made with ❤️ by </span>
      <span>
        <a
          href={env.NEXT_PUBLIC_GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          @rzl-app
        </a>
      </span>
    </div>
  );
};

export default MadeBy;
