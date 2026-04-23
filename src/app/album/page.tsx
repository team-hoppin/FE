import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";

export default function Page() {
  return (
    <main>
      <Input label="뮤지션명" placeholder="아티스트 이름을 입력하세요" />
      <Input placeholder="텍스트를 입력하세요" />

      <Textarea
        label="곡에 대한 스토리 (뮤지션의 말)"
        placeholder="이 곡에 담긴 이야기를 들려주세요"
        maxLength={200}
      />
    </main>
  );
}
