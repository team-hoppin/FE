import { fetcher } from "@/lib/api/common";
import { MusicPromotionInfo } from "@/types/album";
import {
  AnalyzeRes,
  CreateMusicPromotionRes,
  GetMusicPromotionRes,
  GetMyPagePromotionsRes,
} from "@/types/api-response";

/**
 * 뮤지션 홍보 생성
 * [POST] /music-promotions
 */
export async function createMusicPromotion(
  payload: MusicPromotionInfo
): Promise<CreateMusicPromotionRes> {
  try {
    const res = await fetcher<{
      data: CreateMusicPromotionRes;
    }>("/music-promotions", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return res.data;
  } catch {
    throw new Error("[music-promotion]: 뮤지션 홍보 생성 실패");
  }
}

/**
 * 뮤지션 홍보 조회
 * [GET] /music-promotions/{promotionId}
 */
export async function getMusicPromotion(
  promotionId: number
): Promise<GetMusicPromotionRes> {
  try {
    const res = await fetcher<{
      data: GetMusicPromotionRes;
    }>(`/music-promotions/${promotionId}`, {
      method: "GET",
    });

    return res.data;
  } catch (e) {
    console.error("[music-promotion]: 뮤지션 홍보 조회 실패");
    throw e;
  }
}

/**
 * 뮤지션 홍보 수정
 * [PUT] /music-promotions/{promotionId}
 */
export async function updateMusicPromotion(
  promotionId: number,
  payload: MusicPromotionInfo
): Promise<void> {
  try {
    await fetcher(`/music-promotions/${promotionId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("[music-promotion]: 뮤지션 홍보 수정 실패");
  }
}

/**
 * 뮤지션 홍보 삭제
 * [DELETE] /music-promotions/{promotionId}
 */
export async function deleteMusicPromotion(promotionId: number): Promise<void> {
  try {
    await fetcher<void>(`/music-promotions/${promotionId}`, {
      method: "DELETE",
    });
  } catch (e) {
    console.error("[music-promotion]: 뮤지션 홍보 삭제 실패");
    throw e;
  }
}

/**
 * 마이페이지 프로모션 목록 조회
 * [GET] /mypage/promotions
 */
export async function getMyPagePromotions(): Promise<GetMyPagePromotionsRes> {
  try {
    const res = await fetcher<GetMyPagePromotionsRes>("/mypage/promotions", {
      method: "GET",
    });

    return res;
  } catch (e) {
    console.error("[music-promotion]: 마이페이지 프로모션 목록 조회 실패");
    throw e;
  }
}

/**
 * AI 분석 요청
 * [POST] /ai/analyze/{promotionId}
 */
export async function analyzePromotion(
  promotionId: number,
  payload: { sinceDate: string; instagramAccountId: string }
): Promise<AnalyzeRes> {
  try {
    const res = await fetcher<AnalyzeRes>(`/ai/analyze/${promotionId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res;
  } catch {
    throw new Error("[music-promotion]: AI 분석 요청 실패");
  }
}
