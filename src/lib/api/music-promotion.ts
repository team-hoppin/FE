import { fetcher } from "@/lib/api/common";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { AlbumItem, MusicPromotionInfo } from "@/types/album";
import {
  AnalysisJobCreateRes,
  CreateMusicPromotionRes,
  GetAnalysisPageRes,
  GetDiagnosisDetailRes,
  GetMusicPromotionRes,
  GetMyPagePromotionsRes,
  GetMyPagePromotionsTitlesRes,
  ValidateInstagramRes,
} from "@/types/api-response";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
 * 마이페이지 프로모션 제목 목록 조회
 * [GET] /mypage/promotionsTitle
 */
export async function getMyPagePromotionsTitles(
  page = 0
): Promise<GetMyPagePromotionsTitlesRes> {
  try {
    const params = new URLSearchParams({ page: page.toString() });
    const res = await fetcher<GetMyPagePromotionsTitlesRes>(
      `/mypage/promotionsTitle?${params.toString()}`,
      { method: "GET" }
    );
    return res;
  } catch (e) {
    console.error("[music-promotion]: 마이페이지 프로모션 제목 목록 조회 실패");
    throw e;
  }
}

/**
 * 마이페이지 프로모션 목록 조회
 * [GET] /mypage/promotions
 */
export async function getMyPagePromotions(
  page = 0
): Promise<GetMyPagePromotionsRes> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
    });

    const res = await fetcher<GetMyPagePromotionsRes>(
      `/mypage/promotions?${params.toString()}`,
      {
        method: "GET",
      }
    );

    return res;
  } catch (e) {
    console.error("[music-promotion]: 마이페이지 프로모션 목록 조회 실패");
    throw e;
  }
}

/**
 * 마이페이지 프로모션 실시간 스트림 구독 (SSE)
 * [GET] /mypage/promotions/stream
 *
 * 수신 이벤트 :
 * - heartbeat                    : 연결 유지용 이벤트
 * - connected                    : 최초 연결 성공 이벤트
 * - promotion-analysis-updated   : 분석 상태 변경 이벤트
 */
export function subscribePromotionStream({
  onPromotionUpdated,
}: {
  onPromotionUpdated: (updatedPromotion: AlbumItem) => void;
}) {
  const controller = new AbortController();

  fetchEventSource(`${BASE_URL}/mypage/promotions/stream`, {
    method: "GET",

    credentials: "include",

    headers: {
      Accept: "text/event-stream",
    },

    signal: controller.signal,

    openWhenHidden: true, // 브라우저 탭이 백그라운드 상태여도 연결 유지

    async onopen(response) {
      if (!response.ok) {
        throw new Error("SSE 연결 실패");
      }
    },

    // 서버 이벤트 수신
    onmessage(event) {
      switch (event.event) {
        case "heartbeat":
        case "connected":
          return;

        case "promotion-analysis-updated": {
          const updatedPromotion: AlbumItem = JSON.parse(event.data);

          onPromotionUpdated(updatedPromotion);

          return;
        }
      }
    },

    onerror(error) {
      console.error("[SSE] 에러 발생", error);
      throw error;
    },

    onclose() {
      console.log("[SSE] 연결 종료");
    },
  }).catch((e) => {
    console.error("[SSE] fetchEventSource 실패", e);
  });

  return controller;
}

/**
 * 최신 AI 진단 결과 읽음 처리
 * [PATCH] /ai/promotions/{promotionId}/diagnosis/read
 */
export async function patchDiagnosisRead(promotionId: number): Promise<void> {
  try {
    await fetcher(`/ai/promotions/${promotionId}/diagnosis/read`, {
      method: "PATCH",
    });
  } catch (e) {
    console.error("[music-promotion] 읽음 처리 실패", e);
    throw e;
  }
}

/**
 * 미확인 진단 존재 여부 조회
 * [GET] /mypage/promotions/unread-exists
 */
export async function getDiagnosisUnreadExists(): Promise<boolean> {
  try {
    const res: boolean = await fetcher<boolean>(
      "/mypage/promotions/unread-exists",
      {
        method: "GET",
      }
    );

    return res;
  } catch (e) {
    console.error("[music-promotion] 미확인 진단 존재 여부 조회 실패", e);
    throw e;
  }
}

/**
 * 인스타그램 계정 유효성 검사
 * [POST] /crawling/instagram/profile/validate
 */
export async function validateInstagramProfile(
  instagramUsername: string
): Promise<ValidateInstagramRes> {
  try {
    const res = await fetcher<ValidateInstagramRes>(
      "/crawling/instagram/profile/validate",
      {
        method: "POST",
        body: JSON.stringify({ instagramUsername }),
      }
    );
    return res;
  } catch {
    throw new Error("[instagram]: 인스타그램 계정 유효성 검사 실패");
  }
}

/**
 * AI 분석 작업 생성
 * [POST] /ai/analysis-jobs/{promotionId}
 */
export async function analyzePromotion(
  promotionId: number,
  payload: { sinceDate: string; instagramUsername: string }
): Promise<AnalysisJobCreateRes> {
  try {
    const res = await fetcher<AnalysisJobCreateRes>(
      `/ai/analysis-jobs/${promotionId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return res;
  } catch {
    throw new Error("[music-promotion]: AI 분석 요청 실패");
  }
}

/**
 * 홍보 분석 페이지 조회
 * [GET] /music-promotions/{promotionId}/analysis-page
 */
export async function getAnalysisPage(
  promotionId: number,
  page = 0
): Promise<GetAnalysisPageRes> {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  try {
    const res = await fetcher<GetAnalysisPageRes>(
      `/music-promotions/${promotionId}/analysis-page?${params.toString()}`,
      { method: "GET" }
    );

    return res;
  } catch (e) {
    console.error("[music-promotion]: 홍보 분석 페이지 조회 실패");
    throw e;
  }
}

/**
 * 진단 결과 상세 조회
 * [GET] /music-promotions/{promotionId}/diagnoses/{diagnosisId}
 */
export async function getDiagnosisDetail(
  promotionId: number,
  diagnosisId: number
): Promise<GetDiagnosisDetailRes> {
  try {
    const res = await fetcher<GetDiagnosisDetailRes>(
      `/music-promotions/${promotionId}/diagnoses/${diagnosisId}`,
      { method: "GET" }
    );
    return res;
  } catch (e) {
    console.error("[music-promotion]: 진단 결과 상세 조회 실패");
    throw e;
  }
}
