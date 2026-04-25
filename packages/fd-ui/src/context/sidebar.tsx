"use client";

import {
  type ReactNode,
  type RefObject,
  useMemo,
  useRef,
  useState
} from "react";

import { usePathname } from "next/navigation";
import { useOnChange } from "@rzl-zone/core-react/hooks";
import { createRequiredContext } from "@rzl-zone/core-react/context";

type SidebarContextCustom = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * When set to false, don't close the sidebar when navigate to another page
   */
  closeOnRedirectRef: RefObject<boolean>;
};

const SidebarContext = createRequiredContext<SidebarContextCustom>(
  "SidebarContextCustom"
);

export function useSidebarCustom() {
  return SidebarContext.use();
}

export function SidebarProvider({
  children
}: {
  children: ReactNode;
}): ReactNode {
  const closeOnRedirect = useRef(true);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();

  useOnChange(pathname, () => {
    if (closeOnRedirect.current) {
      setOpen(false);
    }
    closeOnRedirect.current = true;
  });

  return (
    <SidebarContext.Provider
      value={useMemo(
        () => ({
          open,
          setOpen,
          collapsed,
          setCollapsed,
          closeOnRedirectRef: closeOnRedirect
        }),
        [open, collapsed]
      )}
    >
      {children}
    </SidebarContext.Provider>
  );
}
