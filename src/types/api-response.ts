import { AlbumItem } from "@/types/album";

/******************************
 * Image Upload
 ******************************/

// 음악 홍보 이미지 업로드 URL 발급 Res
export interface GetCoverImgUploadUrlRes {
  uploadUrl: string;
  imageKey: string;
  imageUrl: string;
}

/******************************
 * Music Promotion
 ******************************/

// 뮤지션 홍보 생성 Res
export interface CreateMusicPromotionRes {
  promotionId: number;
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
}

export interface GetAnalysisPageRes {
  promotionId: number;
  diagnosisSection: {
    status: string;
    diagnosisCards: DiagnosisCard[];
  };
}

// 진단 결과 상세 조회 Res
export interface GetDiagnosisDetailRes {
  headline: string;
  periodLabel: string;
  summaryMetrics: {
    followerEngagementRate: number;
    promoClickRateByEngagement: number;
    streamingClickRateByPromoClick: number;
  };
  diagnosis: {
    highlightSection: string;
  };
  action: {
    title: string;
    metric: string;
    details: string;
  };
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
