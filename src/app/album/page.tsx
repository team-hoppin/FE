import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusIcon } from "lucide-react";

export default function AlbumPage() {
  return (
    <main className="flex flex-col gap-5">
      <div className="mt-10 flex flex-col gap-1">
        <h4 className="h3-bold text-font-basic">신곡에 대해 얘기해주세요</h4>
        <p className="p2-regular text-font-middle">
          간단하게만 채워도 괜찮아요
          <br />
          입력하는 대로 미리보기 페이지에 반영돼요 👀
        </p>
      </div>
      <section className="flex flex-col gap-2">
        <div className="bg-grey1 border-border mb-3 flex h-22 w-22 items-center justify-center rounded-2xl border">
          <button className="c1-medium text-font-light flex flex-col items-center hover:cursor-pointer">
            <PlusIcon size={40} />
            <span>커버 추가</span>
          </button>
        </div>
        <Input label="뮤지션명" placeholder="아티스트 이름을 입력하세요" />
        <Input label="앨범명" placeholder="앨범 / 싱글명을 입력하세요" />
        <Input
          label="발매일"
          placeholder="YYYY.MM.DD"
          iconBtn={<CalendarIcon size={24} />}
        />
        <Input label="스트리밍 링크" placeholder="링크를 붙여넣으세요" />
        <button className="mb-1 flex w-fit flex-col items-center self-center hover:cursor-pointer">
          <div className="bg-font-light mb-1 flex h-5 w-5 items-center justify-center rounded-full">
            <PlusIcon className="text-grey1" size={16} />
          </div>
          <span className="c1-medium text-font-light">링크 추가</span>
        </button>
        <Textarea
          label="곡에 대한 스토리 (뮤지션의 말)"
          placeholder="이 곡에 담긴 이야기를 들려주세요"
          maxLength={200}
        />
      </section>
      <Button variant="btnPurple" size="full">
        홍보 페이지 미리보기
      </Button>
    </main>
  );
}
