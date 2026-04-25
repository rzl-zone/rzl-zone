"use client";
import {
  type ComponentProps,
  type FC,
  Suspense,
  useDeferredValue,
  useId
} from "react";
import { cn } from "@rzl-zone/docs-ui/utils";
import {
  useShiki,
  type UseShikiOptions
} from "@workspace/fd-core/shiki-core/highlight/core/client";

import { CodeBlock, type CodeBlockProps, Pre } from "@/components/codeblock";
import { createRequiredContext } from "@rzl-zone/core-react/context";

export interface DynamicCodeblockProps {
  lang: string;
  code: string;
  /**
   * Extra props for the underlying `<CodeBlock />` component.
   *
   * Ignored if you defined your own `pre` component in `options.components`.
   */
  codeblock?: CodeBlockProps;
  /**
   * Wrap in React `<Suspense />` and provide a fallback.
   *
   * @defaultValue true
   */
  wrapInSuspense?: boolean;
  options?: DistributiveOmit<UseShikiOptions, "lang">;
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

const PropsContext = createRequiredContext<CodeBlockProps | null>(
  "PropsContext",
  null
);

function DefaultPre(props: ComponentProps<"pre">) {
  const extraProps = PropsContext.use() || {};

  return (
    <CodeBlock
      {...props}
      {...extraProps}
      className={cn("my-0", props.className, extraProps?.className)}
    >
      <Pre>{props.children}</Pre>
    </CodeBlock>
  );
}

export function DynamicCodeBlock({
  lang,
  code,
  codeblock,
  options,
  wrapInSuspense = true
}: DynamicCodeblockProps) {
  const id = useId();
  const shikiOptions: UseShikiOptions = {
    lang,
    ...options,
    components: {
      pre: DefaultPre,
      ...options?.components
    }
  };

  const children = (
    <PropsContext.Provider value={codeblock || null}>
      <Internal
        id={id}
        {...useDeferredValue({ code, options: shikiOptions })}
      />
    </PropsContext.Provider>
  );

  if (wrapInSuspense)
    return (
      <Suspense
        fallback={
          <Placeholder
            code={code}
            components={shikiOptions.components}
          />
        }
      >
        {children}
      </Suspense>
    );

  return children;
}

function Placeholder({
  code,
  components = {}
}: {
  code: string;
  components: UseShikiOptions["components"];
}) {
  const { pre: Pre = "pre", code: Code = "code" } = components as Record<
    string,
    FC
  >;

  return (
    <Pre>
      <Code>
        {code.split("\n").map((line, i) => (
          <span
            key={i}
            className="line"
          >
            {line}
          </span>
        ))}
      </Code>
    </Pre>
  );
}

function Internal({
  id,
  code,
  options
}: {
  id: string;
  code: string;
  options: UseShikiOptions;
}) {
  return useShiki(code, options, [id, options.lang, code]);
}
