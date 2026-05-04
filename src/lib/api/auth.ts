import { fetcher } from "@/lib/api/common";
import { GetMeRes } from "@/types/api-response";

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
 * 내 정보 조회
 * [GET] /me
 */
export async function getMe(): Promise<GetMeRes> {
  try {
    const res = await fetcher<GetMeRes>("/me", {
      method: "GET",
    });

    return res;
  } catch {
    throw new Error("[auth]: 내 정보 조회 실패");
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
