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

// 마이페이지 프로모션 목록 조회 Res
export interface MyPagePromotion {
  promotionId: number;
  title: string;
  coverImageUrl: string;
  shareCount: number;
  profileVisitCount: number;
  linkClickCount: number;
}

export interface GetMyPagePromotionsRes {
  promotions: MyPagePromotion[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

/******************************
 * AI Analyze
 ******************************/

export interface AnalyzeRes {
  headline: string;
  diagnosis: {
    bottleneckType: string;
    highlightSection: string;
    shareCount: number;
    profileVisitCount: number;
    linkClickCount: number;
    interpretation: string;
  };
  calculatedMetrics: {
    avgReachPerPost: number;
    avgSharePerPost: number;
    avgProfileVisitPerPost: number;
    shareRateByReach: number;
    profileVisitRateByReach: number;
    linkClickRateByProfileVisit: number;
    linkClickRateByReach: number;
  };
  channelInsight: {
    bestChannel: string;
    bestChannelClickRate: number;
    summary: string;
  };
  postInsight: {
    topPostPattern: string;
    lowPostPattern: string;
    suggestion: string;
  };
  actions: {
    title: string;
    reason: string;
    metric: string;
    example: string;
  }[];
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

/******************************
 * Image Upload
 ******************************/

// 음악 홍보 이미지 업로드 URL 발급 Res
export interface GetCoverImgUploadUrlRes {
  uploadUrl: string;
  imageKey: string;
  imageUrl: string;
}
