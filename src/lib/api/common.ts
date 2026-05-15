import { openAlertModal } from "@/stores/alert-modal-store";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * 공통 API 요청 함수
 * 모든 fetch 요청의 기본 래퍼로 사용
 */
async function fetchWithAuth<T>(
  path: string,
  options: RequestInit,
  retry = true
): Promise<T> {
  const token = getAccessToken();

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return fetchWithAuth<T>(path, options, false);
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (res.status === 403) {
    openAlertModal({
      type: "alert",
      variant: "auth-error",
      message: "계정이 서로 달라요!",
      description: "해당 정보의 계정으로 로그인해야 확인할 수 있어요.",
    });
    throw Object.assign(new Error(), { status: 403 });
  }

  if (!res.ok) {
    throw Object.assign(new Error(), { status: res.status });
  }

  return res.json();
}

export async function fetcher<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  return fetchWithAuth<T>(path, options);
}
