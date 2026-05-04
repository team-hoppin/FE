import { fetcher } from "@/lib/api/common";

/**
 * 로그아웃
 * [POST] /auth/logout
 */
export async function logout(): Promise<void> {
  try {
    await fetcher("/auth/logout", {
      method: "POST",
    });
  } catch {
    throw new Error("[auth]: 로그아웃 실패");
  }
}

/**
 * 회원탈퇴
 * [DELETE] /me/delete
 */
export async function withdraw(): Promise<void> {
  try {
    await fetcher("/me/delete", {
      method: "DELETE",
    });
  } catch {
    throw new Error("[auth]: 회원탈퇴 실패");
  }
}
