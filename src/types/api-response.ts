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
