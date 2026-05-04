import { StreamingCode } from "@/types/album";
import { AuthProvider } from "@/types/api-response";

export const mapToStreamingBtn: Record<
  StreamingCode,
  {
    label: string;
    icon: string;
  }
> = {
  spotify: {
    label: "스포티파이",
    icon: "/spotify.svg",
  },
  applemusic: {
    label: "애플 뮤직",
    icon: "/apple-music.svg",
  },
  melon: {
    label: "멜론",
    icon: "/melon.svg",
  },
  youtubemusic: {
    label: "유튜브 뮤직",
    icon: "/youtube-music.svg",
  },
  soundcloud: {
    label: "사운드클라우드",
    icon: "/soundcloud.svg",
  },
};

export const mapToAuthProvider: Record<
  AuthProvider,
  { icon: string; label: string }
> = {
  GOOGLE: {
    label: "구글",
    icon: "/google-provider.png",
  },
  KAKAO: {
    label: "카카오",
    icon: "/kakao-provider.png",
  },
  NAVER: {
    label: "네이버",
    icon: "/naver-provider.png",
  },
};
