import { AlbumItem, AnalysisStatus } from "@/types/album";

/******************************
 * Musician
 ******************************/

// 로그인 유형
export type AuthProvider = "GOOGLE" | "KAKAO" | "NAVER";

// 내 정보 조회 Res
export interface GetMeRes {
  id: number;
  artistName: string;
  email: string;
  provider: AuthProvider;
}

/******************************
 * Music Promotion
 ******************************/

// 뮤지션 홍보 생성 Res
export interface CreateMusicPromotionRes {
  promotionId: number;
}

// 뮤지션 홍보 조회 Res
export interface GetMusicPromotionRes {
  promotionId: number;
  activityName: string;
  songTitle: string;
  releaseDate: string;
  imageUrl: string;
  shortDescription: string;
  createdAt: string;
  trackingUrl: string;
  streamingLinks: {
    url: string;
    clickUrl: string;
    displayOrder: number;
  }[];
}

// 마이페이지 프로모션 목록 조회 Res
export interface GetMyPagePromotionsRes {
  promotions: AlbumItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/******************************
 * AI Analyze
 ******************************/

// 크롤링 기반 AI 분석 작업 생성 Res
export interface AnalysisJobCreateRes {
  analysisJobId: number;
  status: string;
}

// 홍보 분석 페이지 조회 Res
export interface DiagnosisCard {
  diagnosisId: number;
  diagnosedDate: string;
  bottleneckType: string;
  headline: string;
  actionTitle: string;
  unread: boolean;
  status: AnalysisStatus;
}

export interface GetAnalysisPageRes {
  promotionId: number;
  activityName: string;
  createdAt: string;
  imageUrl: string;
  releaseDate: string;
  songTitle: string;
  shortDescription: string;
  trackingUrl: string;
  streamingLinks: {
    clickCount: number;
    clickShareRate: number;
    clickUrl: string;
    displayOrder: number;
    streamingCode: string;
    url: string;
  }[];
  realtimeStats: {
    trackingClickCount: number;
    streamingClickCount: number;
  };
  diagnosis: DiagnosisCard[];
  diagnosisPage: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
  };
}

// 진단 결과 상세 조회 Res
export interface GetDiagnosisDetailRes {
  headline: string;
  summaryMetrics: {
    followerEngagementRate: number;
    promoClickRateByEngagement: number;
    streamingClickRateByPromoClick: number;
  };
  diagnosis: {
    highlightFrom: string;
    highlightTo: string;
  };
  action?: {
    title: string;
    metric: string;
    details: string;
  };
}

/******************************
 * Image Upload
 ******************************/

// 음악 홍보 이미지 업로드 URL 발급 Res
export interface GetCoverImgUploadUrlRes {
  uploadUrl: string;
  imageKey: string;
  imageUrl: string;
}
