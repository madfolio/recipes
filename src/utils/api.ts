const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/$/, "");

export function toApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedApiBaseUrl}${normalizedPath}`;
}
