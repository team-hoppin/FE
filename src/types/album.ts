/**
 * 홍보 관련
 */
export interface MusicPromotionInfo {
  activityName: string;
  songTitle: string;
  releaseDate: string;
  streamingLinks: {
    url: string;
    redirectUrl?: string;
  }[];
  imageUrl: string;
  shortDescription: string;
}

/**
 * 앨범 관련
 */
export interface AlbumItem {
  promotionId: number;
  title: string;
  coverImageUrl: string;
  createdAt: string;
  totalTrackingLinkClickCount: number;
  totalStreamingLinkClickCount: number;
  analysis: {
    status: AnalysisStatus;
    label: string | null;
    hasUnreadResult: boolean;
    diagnosedAt: string | null;
  };
}

export type AnalysisStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

/**
 * 스트리밍 관련
 */
export type StreamingCode =
  | "spotify"
  | "applemusic"
  | "melon"
  | "youtubemusic"
  | "soundcloud";

export interface StreamingItem {
  code: StreamingCode;
  url: string;
}
