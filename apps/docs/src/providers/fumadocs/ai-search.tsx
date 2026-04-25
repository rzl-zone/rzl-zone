import { cn } from "@rzl-zone/docs-ui/utils";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { MessageCircleIcon } from "@rzl-zone/docs-ui/components/icons/lucide";

import {
  AISearchProvider,
  AISearchPanel,
  AISearchTrigger
} from "@/components/ai/search";

const AiSearchProvider = () => {
  return (
    <AISearchProvider>
      <AISearchPanel />
      <div className={cn("fixed right-2 bottom-2 z-30")}>
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: "info",
              className: "rounded-2xl gap-1.5"
            })
          )}
        >
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </div>
    </AISearchProvider>
  );
};

export default AiSearchProvider;
