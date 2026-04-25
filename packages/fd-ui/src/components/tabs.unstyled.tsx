"use client";

import React, {
  type ComponentProps,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { useEffectEvent } from "@rzl-zone/core-react/hooks";
import { mergeRefs } from "@rzl-zone/core-react/utils/merge-refs";
import { createRequiredContext } from "@rzl-zone/core-react/context";

import {
  Tabs as PrimitiveTabs,
  TabsTrigger as PrimitiveTabsTrigger,
  TabsList as PrimitiveTabsList,
  TabsContent as PrimitiveTabsContent,
  type TabsTriggerProps as PrimitiveTabsTriggerProps,
  type TabsContentProps as PrimitiveTabsContentProps,
  type TabsListProps as PrimitiveTabsListProps
} from "@rzl-zone/docs-ui/components/radix-ui-tabs";
import { useMainRzlFumadocs } from "@/providers/main-rzl-fumadocs";

type ChangeListener = (v: string) => void;
const listeners = new Map<string, ChangeListener[]>();

function addChangeListener(id: string, listener: ChangeListener): void {
  const list = listeners.get(id) ?? [];
  list.push(listener);
  listeners.set(id, list);
}

function removeChangeListener(id: string, listener: ChangeListener): void {
  const list = listeners.get(id) ?? [];
  listeners.set(
    id,
    list.filter((item) => item !== listener)
  );
}

/**
 * @description You better not use it, because for internal
 */
export interface UnstyledTabsProps extends ComponentProps<
  typeof PrimitiveTabs
> {
  /**
   * Identifier for Sharing value of tabs
   */
  groupId?: string;

  /**
   * Enable persistent
   */
  persist?: boolean;

  /**
   * If true, updates the URL hash based on the tab's id
   */
  updateAnchor?: boolean;
}

const UnstyledTabsContext = createRequiredContext<{
  valueToIdMap: Map<string, string>;
}>("UnstyledTabsContext");

/**
 * @description You better not use it, because for internal
 */
function useUnstyledTabContext() {
  return UnstyledTabsContext.use();
}

/**
 * @description You better not use it, because for internal
 */
export type UnstyledTabsListProps = PrimitiveTabsListProps & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * @description You better not use it, because for internal
 */
export const UnstyledTabsList = (props: UnstyledTabsListProps) => (
  <PrimitiveTabsList
    {...props}
    tabIndex={props.tabIndex || -1}
  />
);

/**
 * @description You better not use it, because for internal
 */
export type UnstyledTabsTriggerProps = PrimitiveTabsTriggerProps & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * @description You better not use it, because for internal
 */
export const UnstyledTabsTrigger = (props: UnstyledTabsTriggerProps) => (
  <PrimitiveTabsTrigger
    {...props}
    tabIndex={props.tabIndex || -1}
  />
);

/**
 * @description You better not use it, because for internal
 */
export function UnstyledTabs({
  ref,
  groupId,
  persist = false,
  updateAnchor = false,
  defaultValue,
  value: _value,
  onValueChange: _onValueChange,
  ...props
}: UnstyledTabsProps) {
  const { scrollBehavior } = useMainRzlFumadocs();

  const tabsRef = useRef<HTMLDivElement>(null);
  const [value, setValue] =
    _value === undefined
      ? // eslint-disable-next-line react-hooks/rules-of-hooks -- not supposed to change controlled/uncontrolled
        useState(defaultValue)
      : [_value, _onValueChange ?? (() => undefined)];

  const onChange = useEffectEvent((v: string) => setValue(v));
  const valueToIdMap = useMemo(() => new Map<string, string>(), []);

  useLayoutEffect(() => {
    if (!groupId) return;
    const previous = persist
      ? localStorage.getItem(groupId)
      : sessionStorage.getItem(groupId);

    if (previous) onChange(previous);
    addChangeListener(groupId, onChange);
    return () => {
      removeChangeListener(groupId, onChange);
    };
  }, [groupId, persist]);

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    for (const [value, id] of valueToIdMap.entries()) {
      if (id === hash) {
        onChange(value);
        tabsRef.current?.scrollIntoView();
        break;
      }
    }
  }, [valueToIdMap]);

  return (
    <PrimitiveTabs
      ref={mergeRefs(ref, tabsRef)}
      value={value}
      onValueChange={(v: string) => {
        if (updateAnchor) {
          const id = valueToIdMap.get(v);

          if (id) {
            window.history.replaceState(null, "", `#${id}`);

            const target = document.getElementById(id);
            if (target) {
              target.scrollIntoView(scrollBehavior.intoView);
            }
          }
        }

        if (groupId) {
          listeners.get(groupId)?.forEach((item) => {
            item(v);
          });

          if (persist) localStorage.setItem(groupId, v);
          else sessionStorage.setItem(groupId, v);
        } else {
          setValue(v);
        }
      }}
      {...props}
      tabIndex={props.tabIndex || -1}
    >
      <UnstyledTabsContext.Provider
        value={useMemo(() => ({ valueToIdMap }), [valueToIdMap])}
      >
        {props.children}
      </UnstyledTabsContext.Provider>
    </PrimitiveTabs>
  );
}

/**
 * @description You better not use it, because for internal
 */
export type UnstyledTabsContentProps = PrimitiveTabsContentProps & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * @description You better not use it, because for internal
 */
export function UnstyledTabsContent({
  value,
  ...props
}: UnstyledTabsContentProps) {
  const { valueToIdMap } = useUnstyledTabContext();

  if (props.id) {
    valueToIdMap.set(value, props.id);
  }

  return (
    <PrimitiveTabsContent
      value={value}
      {...props}
      tabIndex={props.tabIndex || -1}
    >
      {props.children}
    </PrimitiveTabsContent>
  );
}
