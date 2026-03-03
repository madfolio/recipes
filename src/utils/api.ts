const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/$/, "");

function getDefaultApiOrigin(): string {
  if (typeof window === "undefined") {
    return "http://localhost:4000";
  }

  const { protocol, hostname } = window.location;

  return `${protocol}//${hostname}:4000`;
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function shouldUseApiOrigin(path: string): boolean {
  return path.startsWith("/planner/") || path.startsWith("/uploads/");
}

export function toApiUrl(path: string): string {
  if (isAbsoluteUrl(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedApiBaseUrl) {
    return `${normalizedApiBaseUrl}${normalizedPath}`;
  }

  if (shouldUseApiOrigin(normalizedPath)) {
    return `${getDefaultApiOrigin()}${normalizedPath}`;
  }

  return normalizedPath;
}
