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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  analyzePromotion,
  getMyPagePromotions,
} from "@/lib/api/music-promotion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import ErrorView from "@/components/common/error-view";

type ReportFormErrors = {
  promotionId: boolean;
  instagram: boolean;
  date: boolean;
};

export default function ReportForm() {
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string>("");
  const [instagram, setInstagram] = useState("@");
  const [errors, setErrors] = useState<ReportFormErrors>({
    promotionId: false,
    instagram: false,
    date: false,
  });
  const [isLoading, setIsLoading] = useState(false);

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
    refetch,
  } = useQuery({
    queryKey: ["myPagePromotions"],
    queryFn: getMyPagePromotions,
  });
  const promotions = promotionsData?.promotions ?? [];

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
      await analyzePromotion(Number(selectedPromotionId), {
        sinceDate: format(date!, "yyyy-MM-dd"),
        instagramAccountId: instagram.replace("@", ""),
      });
      router.push("/report/complete");
    } catch {
      toast.error("분석 요청에 실패했어요. 잠시 후 다시 시도해주세요.");
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
    <main className="flex flex-col">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <Spinner className="text-main" />
        </div>
      )}
      <div className="my-7 flex flex-col gap-1">
        <h4 className="h3-bold text-font-basic">
          홍보가 잘 되고 있는지 확인해봐요
        </h4>
        <p className="p2-regular text-font-middle">
          계정을 연결하면 게시물 반응부터 링크 클릭까지,
          <br />
          어느 부분이 막히고 있는지 바로 찾아드릴게요.
        </p>
      </div>

      <div className="flex flex-col gap-20">
        {/* <button className="text-font-middle bg-allwhite rounded-r2 shadow-btn flex h-15 cursor-pointer items-center gap-4 p-3">
          <Image src="/insta.svg" alt="인스타그램" width={24} height={24} />
          <div className="flex flex-col items-start">
            <h6 className="p2-bold">인스타그램 계정 연동하기</h6>
            <p className="c1-medium text-font-light">
              프로페셔널 계정만 연동 가능해요
            </p>
          </div>
        </button> */}
        {/* <button className="text-font-middle bg-allwhite rounded-r2 shadow-btn flex h-15 items-center gap-4 p-3">
          <Image
            src="/peak-round-sm.svg"
            alt="피크로고"
            width={32}
            height={32}
          />
          <div className="flex flex-col items-start">
            <h6 className="p2-bold">music_peak</h6>
          </div>
        </button> */}

        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h5 className="p1-bold text-font-middle">
              어떤 앨범을 홍보 중이신가요?
            </h5>
            <p className="p2-medium text-font-light">
              생성된 홍보 링크 기준으로 분석해드려요
            </p>
          </div>
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
            <SelectContent position="popper">
              <SelectGroup>
                {promotions.map((p) => (
                  <SelectItem key={p.promotionId} value={String(p.promotionId)}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-font-light c1-medium cursor-pointer">
              홍보 링크가 없으신가요?
            </p>
            <Link
              href={"/album"}
              className="text-main cursor-pointer text-xs font-bold underline"
            >
              새 홍보 링크 만들기
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h5 className="p1-bold text-font-middle">계정을 입력해주세요</h5>
            <p className="p2-medium text-font-light">
              홍보 중이신 인스타그램 계정을 입력해주세요
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
              언제 올린 컨텐츠부터 살펴볼까요?
            </h5>
            <p className="p2-medium text-font-light">
              선택한 날짜 기준으로 피드 게시물의 상호작용이 분석돼요
            </p>
          </div>
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
                    disabled={(d) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const oneYearAgo = new Date(today);
                      oneYearAgo.setFullYear(today.getFullYear() - 1);
                      return d > today || d < oneYearAgo;
                    }}
                    onSelect={(d) => {
                      setDate(d);
                      setCalendarOpen(false);
                      setErrors((prev) => ({ ...prev, date: false }));
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
        </section>

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
        >
          분석 시작하기
        </Button>
      </div>
    </main>
  );
}
