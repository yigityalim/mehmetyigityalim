import { type RefObject, useEffect, useState } from "react";

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(
  elementRef: RefObject<T>,
): ResizeObserverEntry | undefined {
  const [entry, setEntry] = useState<ResizeObserverEntry>();

  const updateEntry = ([entry]: ResizeObserverEntry[]): void =>
    void setEntry(entry);

  useEffect(() => {
    const node = elementRef?.current;
    if (!node) return;

    const observer = new ResizeObserver(updateEntry);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef]);

  return entry;
}
