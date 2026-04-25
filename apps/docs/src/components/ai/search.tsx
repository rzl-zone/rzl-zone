"use client";

import type { SearchTool } from "@/app/api/chat/route";

import {
  type ComponentProps,
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState
} from "react";
import { DefaultChatTransport, type Tool, type UIToolInvocation } from "ai";
import { type UIMessage, useChat, type UseChatHelpers } from "@ai-sdk/react";

import { cn } from "@rzl-zone/docs-ui/utils";
import {
  Loader2,
  MessageCircleIcon,
  RefreshCw,
  SearchIcon,
  Send,
  X
} from "@rzl-zone/docs-ui/components/icons/lucide";
import { Button } from "@rzl-zone/docs-ui/components/button";
import { buttonVariants } from "@rzl-zone/docs-ui/components/cva";
import { Presence } from "@rzl-zone/docs-ui/components/radix-ui-presence";

import { INTERNAL_CODE } from "@/constants/code";
import { Markdown } from "../mdx/markdown";
import { useMainRzlFumadocs } from "@/context/main-rzl-fumadocs";
import { createRequiredContext } from "@rzl-zone/core-react/context";
import { usePathname } from "next/navigation";

const Context = createRequiredContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<UIMessage>;
}>("AISearchContext");

export function AISearchPanelHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  const { setOpen } = useAISearchContext();

  return (
    <div
      className={cn(
        "sticky top-0 flex items-start gap-2 border rounded-xl bg-fd-secondary text-fd-secondary-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div className="px-3 py-2 flex-1">
        <p className="text-sm font-medium mb-2">AI Chat</p>
        <p className="text-xs text-fd-muted-foreground">
          AI can be inaccurate, please verify the answers.
        </p>
      </div>

      <Button
        aria-label="Close"
        tabIndex={-1}
        className={cn(
          buttonVariants({
            size: "icon-sm",
            variant: "ghost",
            className: "text-fd-muted-foreground rounded-full"
          })
        )}
        onClick={() => setOpen(false)}
      >
        <X />
      </Button>
    </div>
  );
}

export function AISearchInputActions() {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === "streaming";

  if (messages.length === 0) return null;

  return (
    <>
      {!isLoading && messages.at(-1)?.role === "assistant" && (
        <Button
          type="button"
          className={cn(
            buttonVariants({
              variant: "warning",
              size: "xs",
              className: "gap-1 px-2.5"
            }),
            "rounded-l-full!"
          )}
          onClick={() => regenerate()}
        >
          <RefreshCw className="size-4" />
          Retry
        </Button>
      )}
      <Button
        type="button"
        className={cn(
          buttonVariants({
            variant: "danger",
            size: "xs",
            className: "px-2.5"
          }),
          !isLoading && messages.at(-1)?.role === "assistant"
            ? "rounded-r-full!"
            : "rounded-full!"
        )}
        onClick={() => {
          setMessages([]);
          // clearError();
        }}
      >
        Clear Chat
      </Button>
    </>
  );
}

const StorageKeyInput = "__ai_search_input";
export function AISearchInput(props: ComponentProps<"form">) {
  const { status, sendMessage, stop, messages } = useChatContext();
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ""
  );
  const isLoading = status === "streaming" || status === "submitted";
  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault();
    void sendMessage({ text: input });
    setInput("");
    localStorage.removeItem(StorageKeyInput);
  };

  useEffect(() => {
    if (isLoading) document.getElementById("nd-ai-input")?.focus();
  }, [isLoading]);

  return (
    <form
      {...props}
      className={cn("flex items-start pe-2", props.className)}
      onSubmit={onStart}
    >
      <div className="flex flex-col w-full">
        <Input
          value={input}
          placeholder={isLoading ? "AI is answering..." : "Ask a question"}
          autoFocus
          className={cn("p-1.5 xs1:p-3")}
          disabled={status === "streaming" || status === "submitted"}
          onChange={(e) => {
            setInput(e.target.value);
            localStorage.setItem(StorageKeyInput, e.target.value);
          }}
          onKeyDown={(event) => {
            if (!event.shiftKey && event.key === "Enter") {
              onStart(event);
            }
          }}
        />
        <div
          className={cn("px-1 w-full", messages.length < 1 ? "mb-2" : "mb-1")}
        >
          {isLoading ? (
            <button
              key="bn"
              type="button"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  className: cn(
                    "w-full",
                    "transition-all rounded-full mt-2 gap-2 flex-col",
                    "x4s:flex-row!"
                  )
                })
              )}
              onClick={stop}
            >
              <Loader2 className="size-4 animate-spin text-fd-muted-foreground" />
              Abort Answer
            </button>
          ) : (
            <Button
              key="bn"
              type="submit"
              className={cn(
                buttonVariants({
                  variant: "success",
                  className: cn(
                    "w-full gap-2",
                    "flex items-center justify-center transition-all rounded-full mt-2 py-0 pt-2 pb-1.5 px-2.25"
                  )
                })
              )}
              disabled={input.length === 0}
            >
              Send
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function List(props: Omit<ComponentProps<"div">, "dir">) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    function callback() {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "instant"
      });
    }

    const observer = new ResizeObserver(callback);
    callback();

    const element = containerRef.current?.firstElementChild;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        "fd-scroll-container overflow-y-auto min-w-0 flex flex-col",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

function Input(props: ComponentProps<"textarea">) {
  // const ref = useRef<HTMLDivElement>(null);
  const shared = cn("col-start-1 row-start-1", props.className);

  return (
    <>
      <textarea
        id="nd-ai-input"
        {...props}
        className={cn(
          "resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none",
          shared
        )}
      />
      {/* <div
        ref={ref}
        className={cn(shared, "break-all invisible")}
      >
        {`${props.value?.toString() ?? ""}\n`}
      </div> */}
    </>
  );
}

const roleName: Record<string, string> = {
  user: "You",
  assistant: "RzlZone Docs"
};

function Message({
  message,
  ...props
}: { message: UIMessage } & ComponentProps<"div">) {
  let markdown = "";
  const searchCalls: UIToolInvocation<SearchTool>[] = [];

  for (const part of message.parts ?? []) {
    if (part.type === "text") {
      markdown += part.text;
      continue;
    }

    if (part.type.startsWith("tool-")) {
      const toolName = part.type.slice("tool-".length);
      const p = part as UIToolInvocation<Tool>;

      if (toolName !== "search" || !p.toolCallId) continue;
      searchCalls.push(p);
    }
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      <p
        className={cn(
          "mb-1 text-sm font-medium text-fd-muted-foreground",
          message.role === "assistant" && "text-fd-primary"
        )}
      >
        {roleName[message.role] ?? "unknown"}
      </p>
      <div className="prose text-sm">
        <Markdown text={markdown} />
      </div>

      {searchCalls.map((call) => {
        return (
          <div
            key={call.toolCallId}
            className="flex flex-row gap-2 items-center mt-3 rounded-lg border bg-fd-secondary text-fd-muted-foreground text-xs p-2"
          >
            <SearchIcon className="size-4" />
            {call.state === "output-error" || call.state === "output-denied" ? (
              <p className="text-fd-error">
                {call.errorText ?? "Failed to search"}
              </p>
            ) : (
              <p>
                {!call.output
                  ? "Searching…"
                  : call.output.length === 0
                    ? "No results"
                    : `${call.output.length} search results`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AISearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setOpen(false);
  }, [pathname]);

  const { bodyScroll } = useMainRzlFumadocs();

  const chat = useChat({
    id: "search",
    transport: new DefaultChatTransport({
      api: "/api/chat"
    })
  });

  useEffect(() => {
    if (open) {
      bodyScroll.setDisableBodyScroll(open);
    } else {
      bodyScroll.setDisableBodyScroll(false);
    }

    return () => {
      bodyScroll.setDisableBodyScroll(false);
    };
  }, [open]);

  return (
    <Context.Provider
      value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}
    >
      {children}
    </Context.Provider>
  );
}

export function AISearchTrigger({
  position = "default",
  className,
  ...props
}: ComponentProps<"button"> & { position?: "default" | "float" }) {
  const { open, setOpen } = useAISearchContext();

  return (
    <Button
      data-state={open ? "open" : "closed"}
      className={cn(
        position === "float" && [
          "fixed bottom-4 gap-3 w-24 inset-e-[calc(--spacing(4)+var(--removed-body-scroll-bar-size,0px))] shadow-lg z-20 transition-[translate,opacity]",
          open && "translate-y-10 opacity-0"
        ],
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {props.children}
    </Button>
  );
}

export function AISearchPanel() {
  const { open, setOpen } = useAISearchContext();
  // const
  useHotKey();

  return (
    <>
      <style
        jsx
        global
      >
        {`
          @keyframes ask-ai-open {
            from {
              translate: 100% 0;
            }
            to {
              translate: 0 0;
            }
          }
          @keyframes ask-ai-close {
            from {
              width: var(--ai-chat-width);
            }
            to {
              width: 0px;
            }
          }
        `}
      </style>
      <Presence present={open}>
        <div
          data-state={open ? "open" : "closed"}
          className="fixed inset-0 z-9999 backdrop-blur-md bg-fd-overlay data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out"
          onClick={() => {
            setOpen(false);
          }}
        />
      </Presence>
      <Presence present={open}>
        <div
          className={cn(
            "overflow-hidden z-9999 bg-fd-card text-fd-card-foreground [--ai-chat-width:400px] 2[--ai-chat-width:460px]",

            // "lg:sticky lg:top-0 lg:h-dvh ",
            "max-lg:fixed max-lg:inset-x-2 max-lg:top-4  ",
            // "lg:in-[#nd-docs-layout]:[grid-area:toc] lg:in-[#nd-notebook-layout]:row-span-full lg:in-[#nd-notebook-layout]:col-start-5",
            "max-lg:border max-lg:rounded-2xl max-lg:shadow-xl",
            "lg:border-s lg:ms-auto ",
            "lg:fixed lg:top-0 lg:right-0 lg:h-full",
            open
              ? "animate-fd-dialog-in lg:animate-[ask-ai-open_200ms]"
              : "animate-fd-dialog-out lg:animate-[ask-ai-close_350ms]"
          )}
        >
          <div className="flex flex-col size-full h-full p-2 max-lg:max-h-[80dvh] lg:p-3 lg:w-(--ai-chat-width) bg-fd-background">
            <AISearchPanelHeader />
            <AISearchPanelList className="flex-1" />
            <div className="rounded-xl border bg-fd-secondary text-fd-secondary-foreground shadow-sm has-focus-visible:shadow-md">
              <AISearchInput />
              <div
                className={cn(
                  "flex justify-center items-center p-1 empty:hidden",
                  "gap-2"
                )}
              >
                <AISearchInputActions />
              </div>
            </div>
          </div>
        </div>
      </Presence>
    </>
  );
}

export function AISearchPanelList({
  className,
  style,
  ...props
}: ComponentProps<"div">) {
  const chat = useChatContext();

  let isCreditError =
    chat.status === "error" &&
    chat.error?.message.includes(
      `code:"${INTERNAL_CODE.ERROR.AI.SEARCH.ERROR.CREDIT_API.code}"`
    );

  let isUserError =
    chat.status === "error" &&
    chat.error?.message.includes(
      `code:"${INTERNAL_CODE.ERROR.AI.SEARCH.ERROR.USER_NOT_FOUND.code}"`
    );

  const prevErrorRef = useRef(false);

  useEffect(() => {
    if (isCreditError && !prevErrorRef.current) {
      prevErrorRef.current = true;

      chat.setMessages((prev) => [
        ...prev,
        {
          id: `credit-error-${crypto.randomUUID()}`,
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Oops, looks like the AI server is having trouble right now.\nPlease try again later."
            }
          ]
        }
      ]);

      chat.clearError();
    }

    if (!isCreditError) {
      prevErrorRef.current = false;
    }
  }, [isCreditError]);

  useEffect(() => {
    if (isUserError && !prevErrorRef.current) {
      prevErrorRef.current = true;

      chat.setMessages((prev) => [
        ...prev,
        {
          id: `user-error-${crypto.randomUUID()}`,
          role: "assistant",
          parts: [
            {
              type: "text",
              text: "Oops, looks like the AI server is having trouble right now.\nPlease try again later."
            }
          ]
        }
      ]);

      chat.clearError();
    }

    if (!isUserError) {
      prevErrorRef.current = false;
    }
  }, [isUserError]);

  const messages = chat.messages.filter((msg) => msg.role !== "system");

  return (
    <List
      className={cn("py-4 overscroll-contain", className)}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)",
        ...style
      }}
      {...props}
    >
      {messages.length === 0 ? (
        <div className="text-sm text-fd-muted-foreground/80 size-full flex flex-col items-center justify-center text-center gap-2">
          <MessageCircleIcon
            fill="currentColor"
            stroke="none"
          />
          <p onClick={(e) => e.stopPropagation()}>Start a new chat below.</p>
        </div>
      ) : (
        <div className="flex flex-col px-3 gap-4">
          {messages.map((item) => (
            <Message
              key={item.id}
              message={item}
            />
          ))}
        </div>
      )}
    </List>
  );
}

export function useHotKey() {
  const { open, setOpen } = useAISearchContext();

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      e.preventDefault();
    }

    if (e.key === "/" && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => window.removeEventListener("keydown", onKeyPress);
  }, []);
}

export function useAISearchContext() {
  const context = Context.useSuspense();
  return context;
}

function useChatContext() {
  const context = useAISearchContext();
  return context.chat;
}
