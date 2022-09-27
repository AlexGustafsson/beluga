import { useEffect, useState } from "react";

/** Return the matched sub page. */
export function useSubPage(
  available: string[],
  defaultPage?: string
): string | undefined {
  const page = location.pathname.replace(/\/$/, "").split("/").pop()!;
  if (available.includes(page)) {
    return page;
  }
  return defaultPage;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
