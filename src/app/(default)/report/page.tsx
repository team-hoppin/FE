"use client";

// import ComingSoon from "@/components/report/coming-soon";

import { Input } from "@/components/common/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Report() {
  const [date, setDate] = useState<Date | undefined>();
  const [errors] = useState({ date: false });

  return (
    <main className="flex flex-col">
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
        <button className="text-font-middle bg-allwhite rounded-r2 shadow-btn flex h-15 cursor-pointer items-center gap-4 p-3">
          <Image src="/insta.svg" alt="인스타그램" width={24} height={24} />
          <div className="flex flex-col items-start">
            <h6 className="p2-bold">인스타그램 계정 연동하기</h6>
            <p className="c1-medium text-font-light">
              프로페셔널 계정만 연동 가능해요
            </p>
          </div>
        </button>
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="앨범 선택하기" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectItem value="앨범명 1">앨범명 1</SelectItem>
                <SelectItem value="앨범명 2">앨범명 2</SelectItem>
                <SelectItem value="앨범명 3">앨범명 3</SelectItem>
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
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="flex items-center justify-center hover:cursor-pointer"
                    type="button"
                    aria-label="발매일 날짜 선택"
                  >
                    <CalendarIcon size={24} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            }
          />
        </section>
        {/* <Button variant="btnPurple" size="full" disabled={!date}>
          진단 시작하기
        </Button> */}
        <Button variant="btnPurple" size="full">
          진단 시작하기
        </Button>
      </div>
      {/* <ComingSoon /> */}
    </main>
  );
}
