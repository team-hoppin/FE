/**
 * 앨범 정보 입력 유효성 검사
 */

export type AlbumFormValues = {
  cover: File | null;
  coverPreview: string;
  artist: string;
  albumName: string;
  date: Date | undefined;
  links: string[];
  description: string;
};

export type AlbumFormErrors = {
  cover: boolean;
  artist: boolean;
  albumName: boolean;
  date: boolean;
  links: boolean[];
  description: boolean;
};

// 단일 필드 유효성 검사
export const validateField = <K extends keyof AlbumFormValues>(
  field: K,
  value: AlbumFormValues[K],
  extra?: string
): boolean | boolean[] => {
  switch (field) {
    case "cover":
      return !!(value || extra); // coverFile or preview
    case "artist":
    case "albumName":
    case "description":
      return !!(value as string).trim();
    case "date":
      return !!value;
    case "links":
      return (value as string[]).map((l) => l.trim() !== "");
    default:
      return true;
  }
};

// 전체 유효성 검사
export const validateAll = (values: AlbumFormValues): AlbumFormErrors => {
  const linkErrors = values.links.map((l) => l.trim() === "");

  return {
    cover: !(values.cover || values.coverPreview),
    artist: !values.artist.trim(),
    albumName: !values.albumName.trim(),
    date: !values.date,
    links: linkErrors,
    description: !values.description.trim(),
  };
};

// 전체 폼 유효한지 여부 판단
export const isAlbumFormValid = (errors: AlbumFormErrors) => {
  return (
    !errors.cover &&
    !errors.artist &&
    !errors.albumName &&
    !errors.date &&
    !errors.description &&
    errors.links.every((e) => !e)
  );
};
