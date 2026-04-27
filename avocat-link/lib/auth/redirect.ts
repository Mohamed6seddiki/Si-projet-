const DEFAULT_REDIRECT_PATH = "/dashboard";
const INTERNAL_BASE_URL = "http://localhost";

export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = DEFAULT_REDIRECT_PATH,
) {
  if (!value) {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, INTERNAL_BASE_URL);

    if (parsed.origin !== INTERNAL_BASE_URL) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function createAuthCallbackUrl(baseUrl: string, nextPath: string) {
  const callbackUrl = new URL("/auth/callback", baseUrl);
  callbackUrl.searchParams.set("next", getSafeRedirectPath(nextPath));
  return callbackUrl.toString();
}
