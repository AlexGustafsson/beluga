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
