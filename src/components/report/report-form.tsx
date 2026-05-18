"use client";

import { Input } from "@/components/common/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import BackButton from "@/components/common/back-button";
import ErrorView from "@/components/common/error-view";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  analyzePromotion,
  getMyPagePromotionsTitles,
  validateInstagramProfile,
} from "@/lib/api/music-promotion";
import { format } from "date-fns";
import CalendarInput from "../common/calendar-input";

type ReportFormErrors = {
  promotionId: boolean;
  instagram: boolean;
  date: boolean;
};

export default function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const promotionIdFromQuery = searchParams.get("promotionId");

  const [date, setDate] = useState<Date | undefined>();
  const [selectedPromotionId, setSelectedPromotionId] = useState<string>(
    promotionIdFromQuery ?? ""
  );
  const [instagram, setInstagram] = useState("@");
  const [errors, setErrors] = useState<ReportFormErrors>({
    promotionId: false,
    instagram: false,
    date: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const openAlertModal = useOpenAlertModal();

  const isValidInstagram = (value: string) =>
    /^@[a-zA-Z0-9._]{1,30}$/.test(value);

  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const next = val.startsWith("@") ? val : "@" + val.replace(/^@*/, "");
    setInstagram(next);
    if (next === "@") {
      setErrors((prev) => ({ ...prev, instagram: false }));
    } else {
      setErrors((prev) => ({ ...prev, instagram: !isValidInstagram(next) }));
    }
  };

  const {
    data: promotionsData,
    isLoading: isPromotionsLoading,
    isError: isPromotionsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["myPagePromotionsTitles"],
    queryFn: ({ pageParam }) => getMyPagePromotionsTitles(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
  });

  // 조회된 프로모션 목록 (전체 페이지 합산)
  const promotions = promotionsData?.pages.flatMap((p) => p.promotions) ?? [];

  // 쿼리를 통해 전달된 프로모션
  const queryPromotion = promotions.find(
    (p) => String(p.promotionId) === promotionIdFromQuery
  );

  const handleSelectScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const remaining = scrollHeight - scrollTop - clientHeight;
    if (
      scrollTop > 0 &&
      remaining <= 50 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  const handleSubmit = async () => {
    const newErrors: ReportFormErrors = {
      promotionId: !selectedPromotionId,
      instagram: !isValidInstagram(instagram),
      date: !date,
    };
    setErrors(newErrors);

    if (newErrors.promotionId || newErrors.instagram || newErrors.date) return;

    setIsLoading(true);
    try {
      const username = instagram.replace("@", "");

      const { valid } = await validateInstagramProfile(username);
      if (!valid) {
        openAlertModal({
          type: "alert",
          variant: "warning",
          message: (
            <>
              인스타그램 계정이 존재하지 않거나{"\n"}비공개일 경우 진단할 수
              없어요.{"\n"}
              <span className="p2-semibold">
                올바른 계정 이름을 입력해주세요.
              </span>
            </>
          ),
        });
        return;
      }

      await analyzePromotion(Number(selectedPromotionId), {
        sinceDate: format(date!, "yyyy-MM-dd"),
        instagramUsername: username,
      });
      router.push(`/report/complete?promotionId=${selectedPromotionId}`);
    } catch {
      openAlertModal({
        type: "alert",
        variant: "warning",
        message: "분석 요청에 실패했어요. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPromotionsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="text-main" />
      </div>
    );
  }

  if (isPromotionsError) {
    return (
      <ErrorView
        title={`요청하신 화면을\n불러오지 못했어요`}
        description={`페이지가 없거나 연결이 잠시 불안정해요.\n잠시 후 다시 시도해주세요.`}
        onAction={refetch}
        actionLabel="다시 시도하기"
      />
    );
  }

  return (
    <>
      <main className="flex min-h-[calc(100dvh-var(--header-height)-var(--page-padding-bottom))] flex-col">
        <BackButton />
        <div className="mb-6 flex flex-col gap-6">
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
              <Spinner className="text-main" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h4 className="h3-bold text-font-basic">
              홍보가 잘 되고 있는지 확인해봐요
            </h4>
            <p className="p2-regular text-font-middle">
              인스타 계정을 입력하면 피드 반응부터 홍보 링크 클릭까지
              <br />
              어느 부분이 막히고 있는지 바로 찾아드릴게요.
            </p>
          </div>

          <div className="flex flex-col gap-7.5">
            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h5 className="p1-bold text-font-middle">
                  어떤 앨범을 홍보 중이신가요?
                </h5>
                <p className="p2-medium text-font-light">
                  생성된 홍보 페이지 기준으로 분석해드려요
                </p>
              </div>

              {!!queryPromotion ? (
                <div className="border-border rounded-r1 flex h-10 items-center border px-4">
                  <span className="p2-medium text-font-basic">
                    {queryPromotion.title}
                  </span>
                </div>
              ) : (
                <>
                  <Select
                    value={selectedPromotionId}
                    onValueChange={(v) => {
                      setSelectedPromotionId(v);
                      setErrors((prev) => ({ ...prev, promotionId: false }));
                    }}
                  >
                    <SelectTrigger
                      className={errors.promotionId ? "border-danger" : ""}
                      disabled={promotions.length === 0}
                    >
                      <SelectValue
                        placeholder={
                          promotions.length === 0
                            ? "생성된 홍보 링크가 없어요"
                            : "앨범 선택하기"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      onViewportScroll={handleSelectScroll}
                      viewportClassName="max-h-33"
                    >
                      <SelectGroup>
                        {promotions.map((p) => (
                          <SelectItem
                            key={p.promotionId}
                            value={String(p.promotionId)}
                          >
                            {p.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      {isFetchingNextPage && (
                        <div className="flex justify-center py-2">
                          <Spinner className="text-main" />
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-col gap-1 text-center">
                    <p className="text-font-light c1-medium cursor-pointer">
                      홍보 페이지가 없으신가요?
                    </p>
                    <Link
                      href={"/album"}
                      className="text-main cursor-pointer text-xs font-bold underline"
                    >
                      새 홍보 페이지 만들기
                    </Link>
                  </div>
                </>
              )}
            </section>

            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h5 className="p1-bold text-font-middle">
                  계정을 입력해주세요
                </h5>
                <p className="p2-medium text-font-light">
                  진단을 원하시는 인스타그램 계정을 입력해주세요
                </p>
                <Input
                  className={
                    errors.instagram
                      ? "border-danger focus-visible:ring-danger"
                      : ""
                  }
                  label="인스타그램 계정"
                  placeholder="인스타그램 계정을 입력해주세요"
                  maxLength={31}
                  value={instagram}
                  onChange={handleInstagramChange}
                />
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h5 className="p1-bold text-font-middle">
                  언제 올린 게시물부터 살펴볼까요?
                </h5>
                <p className="p2-medium text-font-light">
                  선택한 날짜 기준으로 피드 게시물의 상호작용이 분석돼요
                </p>
              </div>
              <CalendarInput
                className="bg-white"
                label="날짜 선택하기"
                value={date}
                error={errors.date}
                disabled={(d) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const oneYearAgo = new Date(today);
                  oneYearAgo.setFullYear(today.getFullYear() - 1);
                  return d > today || d < oneYearAgo;
                }}
                onChange={(d) => {
                  setDate(d);

                  if (d) {
                    setErrors((prev) => ({
                      ...prev,
                      date: false,
                    }));
                  }
                }}
              />
            </section>
          </div>
        </div>
        <Button
          variant="btnPurple"
          size="full"
          disabled={
            !selectedPromotionId ||
            !isValidInstagram(instagram) ||
            !date ||
            isLoading
          }
          onClick={handleSubmit}
          className="mt-auto"
        >
          진단 신청하기
        </Button>
      </main>
    </>
  );
}
