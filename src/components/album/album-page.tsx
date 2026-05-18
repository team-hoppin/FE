"use client";

import BackButton from "@/components/common/back-button";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CalendarInput from "@/components/common/calendar-input";
import { PlusIcon, ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { uploadCoverImg } from "@/lib/api/uploads";
import {
  createMusicPromotion,
  getMusicPromotion,
  updateMusicPromotion,
} from "@/lib/api/music-promotion";
import { getStreamingCode } from "@/utils/album";
import { validateAll, isAlbumFormValid } from "@/utils/validation";
import { format } from "date-fns";

const MAX_COVER_IMG_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_LINK = 4;

export default function AlbumPage() {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();

  // 수정 모드 여부 판단
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit"); // 수정 프로모션 아이디
  const from = searchParams.get("from"); // 진입점 (상세페이지: detail || 분석페이지: analysis)
  const isEditMode = !!editId;

  // 앨범 커버 이미지 상태
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  // 앨범 정보 입력값 상태
  const [artist, setArtist] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [links, setLinks] = useState<string[]>([""]);
  const [originalLinks, setOriginalLinks] = useState<
    { url: string; clickUrl: string }[]
  >([]);
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 폼 유효성 검사
  const isFormValid = useMemo(() => {
    return isAlbumFormValid(
      validateAll({
        cover: coverFile,
        coverPreview,
        artist,
        albumName,
        date,
        links,
        description,
      })
    );
  }, [coverFile, coverPreview, artist, albumName, date, links, description]);

  const handleSelectImage = (file: File) => {
    if (file.size > MAX_COVER_IMG_SIZE) {
      openAlertModal({
        type: "alert",
        variant: "warning",
        message: (
          <>
            <span className="p2-semibold">최대 30MB 이하</span>의 이미지만{"\n"}
            업로드할 수 있어요.
          </>
        ),
      });
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleAddLink = () => {
    if (links.length >= MAX_LINK) return;

    setLinks((prev) => [...prev, ""]);
  };

  const handleRemoveLink = (idx: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateLink = (idx: number, value: string) => {
    const newLinks = [...links];
    newLinks[idx] = value;
    setLinks(newLinks);
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
              스포티파이 ∙ 유튜브뮤직 ∙ 애플뮤직 ∙ 멜론{"\n"}사운드클라우드
            </span>{" "}
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
    if (isSubmitting || !isFormValid) return;

    setIsSubmitting(true);

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
        router.push(
          `/album/${editId}${from === "analysis" ? "?from=analysis" : ""}`
        );
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="flex min-h-[calc(100dvh-var(--header-height)-var(--page-padding-bottom))] flex-col">
        <BackButton />
        <div className="mb-6 flex flex-col gap-6">
          <div className="mb-1 flex flex-col gap-1">
            <h4 className="h3-bold text-font-basic">
              앨범에 대해 얘기해주세요
            </h4>
            <p className="p2-regular text-font-middle">
              뮤지션의 한마디가 스트리밍으로 이어져요.
              <br />
              구체적일수록 앨범의 매력을 더 잘 전달할 수 있어요.
            </p>
          </div>

          <section className="flex flex-col gap-2">
            <div className="mb-1 flex items-center gap-3">
              <div className="bg-grey1 border-border flex h-22 w-22 shrink-0 items-center justify-center overflow-hidden rounded-2xl border">
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
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSelectImage(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className="text-font-light text-c1 font-regular whitespace-pre-line">
                <span className="font-semibold">
                  30MB 이하의 JPG, JPEG, PNG,{"\n"}WEBP
                </span>{" "}
                형식의 이미지만 업로드할 수 있어요.
              </div>
            </div>

            <Input
              label="뮤지션명"
              placeholder="뮤지션명을 입력하세요"
              maxLength={50}
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />

            <Input
              label="앨범명"
              placeholder="앨범 / 싱글명을 입력하세요"
              maxLength={50}
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
            />

            <CalendarInput label="발매일" value={date} onChange={setDate} />

            {links.map((link, idx) => (
              <Input
                key={idx}
                label={idx === 0 ? "스트리밍 링크" : undefined}
                placeholder="링크를 추가하세요"
                value={link}
                onChange={(e) => handleUpdateLink(idx, e.target.value)}
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
              <>
                <p className="c1-medium text-font-light">
                  * 스포티파이, 유튜브뮤직, 애플뮤직, 멜론, 사운드클라우드만
                  가능해요.
                </p>
                <button
                  className="my-1 flex w-fit flex-col items-center self-center hover:cursor-pointer"
                  type="button"
                  onClick={handleAddLink}
                  disabled={links.length >= MAX_LINK}
                >
                  <div className="bg-font-light mb-1 flex h-5 w-5 items-center justify-center rounded-full">
                    <PlusIcon className="text-grey1" size={16} />
                  </div>
                  <span className="c1-medium text-font-light">링크 추가</span>
                </button>
              </>
            )}

            <Textarea
              label="뮤지션의 한 마디"
              placeholder="앨범에 담긴 이야기를 들려주세요"
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </section>
        </div>
        <Button
          variant="btnPurple"
          size="full"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="mt-auto"
        >
          {isEditMode ? "수정 완료" : "홍보 페이지 만들기"}
        </Button>
      </main>
    </>
  );
}
