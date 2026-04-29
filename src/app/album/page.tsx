"use client";

import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const MAX_LINK = 4;

export default function AlbumPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [links, setLinks] = useState<string[]>([""]);

  const handleAddLink = () => {
    if (links.length >= MAX_LINK) return;
    setLinks((prev) => [...prev, ""]);
  };

  const handleRemoveLink = (idx: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <main className="flex flex-col">
      <div className="mt-10 mb-7 flex flex-col gap-1">
        <h4 className="h3-bold text-font-basic">신곡에 대해 얘기해주세요</h4>
        <p className="p2-regular text-font-middle">
          간단하게만 채워도 괜찮아요
          <br />
          입력하는 대로 미리보기 페이지에 반영돼요 👀
        </p>
      </div>
      <section className="mb-5 flex flex-col gap-2">
        <div className="bg-grey1 border-border mb-1 flex h-22 w-22 items-center justify-center rounded-2xl border">
          <button
            className="c1-medium text-font-light flex flex-col items-center hover:cursor-pointer"
            aria-label="앨범 커버 이미지 추가"
          >
            <PlusIcon size={40} />
            <span>커버 추가</span>
          </button>
        </div>
        <Input
          label="뮤지션명"
          placeholder="아티스트 이름을 입력하세요"
          maxLength={50}
        />
        <Input
          label="앨범명"
          placeholder="앨범 / 싱글명을 입력하세요"
          maxLength={50}
        />
        <Input
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
        {links.map((link, idx) => (
          <Input
            key={idx}
            label={idx === 0 ? "스트리밍 링크" : undefined}
            placeholder="링크를 붙여넣으세요"
            value={link}
            onChange={(e) => {
              const newLinks = [...links];
              newLinks[idx] = e.target.value;
              setLinks(newLinks);
            }}
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
          label="곡에 대한 스토리 (뮤지션의 말)"
          placeholder="이 곡에 담긴 이야기를 들려주세요"
          maxLength={200}
        />
      </section>
      <Button variant="btnPurple" size="full">
        홍보 링크 생성하기
      </Button>
    </main>
  );
}
