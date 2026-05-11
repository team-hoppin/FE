"use client";

import BackButton from "@/components/common/back-button";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { PlusIcon, ImageIcon, CalendarIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { uploadCoverImg } from "@/lib/api/uploads";
import {
  createMusicPromotion,
  getMusicPromotion,
  updateMusicPromotion,
} from "@/lib/api/music-promotion";
import { getStreamingCode } from "@/utils/album";
import {
  validateField,
  validateAll,
  isAlbumFormValid,
  AlbumFormValues,
  AlbumFormErrors,
} from "@/utils/validation";
import { format } from "date-fns";

const VALID_COVER_IMG_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_LINK = 4;

export default function AlbumPage() {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();

  // 수정 모드 여부 판단
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  // 앨범 커버 이미지 상태
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  // 앨범 정보 입력값 상태
  const [artist, setArtist] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [links, setLinks] = useState<string[]>([""]);
  const [originalLinks, setOriginalLinks] = useState<
    { url: string; clickUrl: string }[]
  >([]);
  const [description, setDescription] = useState("");

  // 유효성 검사 실패 여부 상태 ( true = validation 실패 )
  const [errors, setErrors] = useState<AlbumFormErrors>({
    cover: false,
    artist: false,
    albumName: false,
    date: false,
    links: [false],
    description: false,
  });

  useEffect(() => {
    if (!editId) return;

    const fetchData = async () => {
      const data = await getMusicPromotion(Number(editId));

      setCoverPreview(data.imageUrl);
      setArtist(data.activityName);
      setAlbumName(data.songTitle);
      setDate(new Date(data.releaseDate));
      setDescription(data.shortDescription);

      const sortedLinks = data.streamingLinks.sort(
        (a, b) => a.displayOrder - b.displayOrder
      );

      setLinks(sortedLinks.map((link) => link.url));

      // 원본 링크 저장 ( 기존 링크와 같은 링크는 redirectUrl을 포함시키기 위함 )
      setOriginalLinks(
        sortedLinks.map((link) => ({
          url: link.url,
          clickUrl: link.clickUrl,
        }))
      );
    };

    fetchData();
  }, [editId]);

  // 공통 업데이트 함수
  const updateField = <K extends keyof AlbumFormValues>(
    field: K,
    value: AlbumFormValues[K],
    setter: (v: AlbumFormValues[K]) => void
  ) => {
    setter(value);

    const valid = validateField(field, value);

    if (typeof valid === "boolean" && valid) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // 링크 전용 업데이트 함수
  const updateLink = (idx: number, value: string) => {
    const newLinks = [...links];
    newLinks[idx] = value;
    setLinks(newLinks);

    const valid = validateField("links", newLinks);

    if (Array.isArray(valid)) {
      setErrors((prev) => ({
        ...prev,
        links: valid.map((r) => !r),
      }));
    }
  };

  // 유효성 검사
  const validate = () => {
    const newErrors = validateAll({
      cover: coverFile,
      coverPreview,
      artist,
      albumName,
      date,
      links,
      description,
    });

    setErrors(newErrors);

    return isAlbumFormValid(newErrors);
  };

  const handleSelectImage = (file: File) => {
    if (!VALID_COVER_IMG_TYPES.includes(file.type)) {
      openAlertModal({
        type: "alert",
        message: (
          <>
            지원하지 않는 파일 형식입니다.{"\n"}
            <span className="p2-semibold">JPG, JPEG, PNG, WEBP</span> 형식의
            이미지만 {"\n"}
            업로드할 수 있습니다.
          </>
        ),
      });
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      cover: false,
    }));
  };

  const handleAddLink = () => {
    if (links.length >= MAX_LINK) return;

    setLinks((prev) => [...prev, ""]);

    setErrors((prev) => ({
      ...prev,
      links: [...prev.links, false],
    }));
  };

  const handleRemoveLink = (idx: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));

    setErrors((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== idx),
    }));
  };

  const handleBlurLink = (value: string, idx: number) => {
    if (!value.trim()) return;

    const code = getStreamingCode(value);

    if (!code) {
      openAlertModal({
        type: "alert",
        variant: "warning",
        message: (
          <>
            <span className="p2-semibold">
              스포티파이 ∙ 애플뮤직 ∙ 멜론 ∙ 유튜브뮤직 ∙ 사운드클라우드{"\n"}
            </span>
            링크만 입력 가능해요.
          </>
        ),
      });

      setLinks((prev) => {
        const copy = [...prev];
        copy[idx] = "";
        return copy;
      });
    }

    return;
  };

  const handleSubmit = async () => {
    const isValid = validate();

    if (!isValid) return;

    try {
      // 1. 새 이미지를 선택했을 때 이미지 업로드
      let imageUrl = coverPreview;

      if (coverFile) {
        imageUrl = await uploadCoverImg(coverFile);
      }

      // 2. payload 생성
      const payload = {
        activityName: artist,
        songTitle: albumName,
        releaseDate: format(date!, "yyyy-MM-dd"),
        streamingLinks: links
          .filter((link) => link.trim() !== "")
          .map((link) => {
            // 기존 링크인지 검사
            const oLink = originalLinks.find((origin) => origin.url === link);

            if (oLink) {
              // 기존 링크 → redirectUrl 포함
              return {
                url: link,
                redirectUrl: oLink.clickUrl,
              };
            }

            // 신규 링크 → url만
            return {
              url: link,
            };
          }),
        imageUrl: imageUrl,
        shortDescription: description,
      };

      if (isEditMode) {
        // 3. 뮤지션 홍보 수정 API 호출
        await updateMusicPromotion(Number(editId), payload);
        toast.success("수정이 완료되었습니다!", { position: "bottom-center" });
        router.push(`/album/${editId}`);
      } else {
        // 3. 뮤지션 홍보 생성 API 호출
        const { promotionId } = await createMusicPromotion(payload);
        router.push(`/album/${promotionId}`);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        isEditMode ? "수정에 실패했습니다." : "홍보 링크 생성에 실패했습니다.",
        { position: "bottom-center" }
      );
    }
  };

  return (
    <>
      <BackButton />
      <main className="flex flex-col">
        <div className="my-7 flex flex-col gap-1">
          <h4 className="h3-bold text-font-basic">신곡에 대해 얘기해주세요</h4>
          <p className="p2-regular text-font-middle">
            뮤지션의 한마디가 스트리밍으로 이어져요.
            <br />
            구체적일수록 음원의 매력을 더 잘 전달할 수 있어요.
          </p>
        </div>

        <section className="mb-5 flex flex-col gap-2">
          <div
            className={`bg-grey1 mb-1 flex h-22 w-22 items-center justify-center overflow-hidden rounded-2xl border ${
              errors.cover ? "border-danger" : "border-border"
            }`}
          >
            <label className="relative flex h-full w-full cursor-pointer items-center justify-center">
              {coverPreview ? (
                <>
                  <Image
                    src={coverPreview}
                    alt="앨범 커버 이미지"
                    width={88}
                    height={88}
                    className="object-cover"
                  />

                  {/* 딤 + 아이콘 오버레이 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <ImageIcon className="text-white" size={24} />
                  </div>
                </>
              ) : (
                <div className="c1-medium text-font-light flex flex-col items-center">
                  <PlusIcon size={40} />
                  <span>커버 추가</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelectImage(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <Input
            className={
              errors.artist ? "border-danger focus-visible:ring-danger" : ""
            }
            label="뮤지션명"
            placeholder="아티스트 이름을 입력하세요"
            maxLength={50}
            value={artist}
            onChange={(e) => updateField("artist", e.target.value, setArtist)}
          />

          <Input
            className={
              errors.albumName ? "border-danger focus-visible:ring-danger" : ""
            }
            label="앨범명"
            placeholder="앨범 / 싱글명을 입력하세요"
            maxLength={50}
            value={albumName}
            onChange={(e) =>
              updateField("albumName", e.target.value, setAlbumName)
            }
          />

          <Input
            className={
              errors.date ? "border-danger focus-visible:ring-danger" : ""
            }
            label="발매일"
            placeholder="YYYY.MM.DD"
            value={date ? format(date, "yyyy.MM.dd") : ""}
            readOnly
            iconBtn={
              <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center justify-center hover:cursor-pointer"
                    type="button"
                    aria-label="발매일 날짜 선택"
                  >
                    <CalendarIcon size={24} />
                  </button>
                </DialogTrigger>
                <DialogContent
                  className="max-w-2xs p-0"
                  showCloseButton={false}
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setCalendarOpen(false);
                    }}
                    className="flex w-full"
                    classNames={{
                      months:
                        "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                      month: "space-y-4 w-full flex flex-col",
                      table: "w-full h-full border-collapse space-y-1",
                      head_row: "",
                      row: "w-full mt-2",
                    }}
                  />
                </DialogContent>
              </Dialog>
            }
          />

          {links.map((link, idx) => (
            <Input
              className={
                errors.links[idx]
                  ? "border-danger focus-visible:ring-danger"
                  : ""
              }
              key={idx}
              label={idx === 0 ? "스트리밍 링크" : undefined}
              placeholder="링크를 붙여넣으세요"
              value={link}
              onChange={(e) => updateLink(idx, e.target.value)}
              onBlur={(e) => handleBlurLink(e.target.value, idx)}
              iconBtn={
                links.length > 1 && (
                  <button
                    className="flex items-center justify-center hover:cursor-pointer"
                    type="button"
                    aria-label={`스트리밍 링크 ${idx + 1} 삭제`}
                    onClick={() => handleRemoveLink(idx)}
                  >
                    <XIcon size={16} />
                  </button>
                )
              }
            />
          ))}
          {links.length < MAX_LINK && (
            <button
              className="mb-1 flex w-fit flex-col items-center self-center hover:cursor-pointer"
              type="button"
              onClick={handleAddLink}
              disabled={links.length >= MAX_LINK}
            >
              <div className="bg-font-light mb-1 flex h-5 w-5 items-center justify-center rounded-full">
                <PlusIcon className="text-grey1" size={16} />
              </div>
              <span className="c1-medium text-font-light">링크 추가</span>
            </button>
          )}

          <Textarea
            className={
              errors.description
                ? "border-danger focus-visible:ring-danger"
                : ""
            }
            label="곡에 대한 스토리 (뮤지션의 말)"
            placeholder="이 곡에 담긴 이야기를 들려주세요"
            maxLength={200}
            value={description}
            onChange={(e) =>
              updateField("description", e.target.value, setDescription)
            }
          />
        </section>

        <Button variant="btnPurple" size="full" onClick={handleSubmit}>
          {isEditMode ? "수정 완료" : "홍보 링크 생성하기"}
        </Button>
      </main>
    </>
  );
}
