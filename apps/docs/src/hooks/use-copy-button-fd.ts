"use client";

import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState
} from "react";
import {
  toast,
  type ExternalToast,
  type ToastT
} from "@rzl-zone/docs-ui/components/sonner";

export function useCopyButtonFD({
  onCopy,
  debounceCopy = 1250,
  toastOptions = {
    type: "success"
  }
}: {
  /**
   * @default 1250
   */
  debounceCopy?: number;
  onCopy: () => void | Promise<void>;
  toastOptions?: {
    enable?: boolean;
  } & ExternalToast & {
      /**
       * @default "success"
       */
      type?: ToastT["type"];
    };
}): [checked: boolean, onClick: MouseEventHandler] {
  const [checked, setChecked] = useState(false);
  const checkedRef = useRef(false);
  // const callbackRef = useRef(onCopy);
  const timeoutRef = useRef<number | null>(null);

  // callbackRef.current = onCopy;
  const onCopyEvent = useEffectEvent(onCopy);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (checkedRef.current) {
        e.preventDefault();
        return;
      }

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      void Promise.resolve(onCopyEvent()).then(() => {
        setChecked(true);
        toast("Code copied to clipboard", {
          duration: debounceCopy + debounceCopy / 10,
          ...toastOptions
        });
        timeoutRef.current = window.setTimeout(() => {
          setChecked(false);
        }, debounceCopy);
      });
    },
    // eslint-disable-next-line react-hooks/rules-of-hooks
    [debounceCopy, onCopyEvent]
  );

  useEffect(() => {
    checkedRef.current = checked;
  }, [checked]);

  // Avoid updates after being unmounted
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      checkedRef.current = false;
    };
  }, []);

  return [checked, onClick];
}
