import { TagVariant } from "./client";

export function formatImageDisplayName(owner: string, name: string): string {
  return owner == "_" ? name : `${owner}/${name}`;
}

export function formatImageURL(owner: string, name: string): string {
  return `/images/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}

export function formatLayersURL(
  owner: string,
  name: string,
  digest: string,
  digestAlgorithm: string
): string {
  return `${formatImageURL(owner, name)}/layers/${digestAlgorithm}-${digest}`;
}

export function preferredArch(): { os: string; arch: string } {
  // const platform =
  //   navigator.userAgentData?.platform || navigator.platform || "";
  const platform = navigator.platform || "";
  const os = platform.startsWith("Win") ? "Windows" : "Linux";
  let arch = "amd64";
  if (platform.startsWith("Linux")) {
    const parts = platform.split(" ");
    if (parts.length) {
      arch = parts[1];
    }
  }
  return { os, arch };
}

export function preferredTagVariant(variants: TagVariant[]): TagVariant | null {
  const { os, arch } = preferredArch();
  const wanted = variants.filter((x) => x.os === os && x.arch === arch);
  const ok = variants.filter((x) => x.arch === "amd64");
  if (wanted.length > 0) {
    return wanted[0];
  } else if (ok.length > 0) {
    return ok[0];
  } else if (variants.length > 0) {
    return variants[0];
  }

  return null;
}
