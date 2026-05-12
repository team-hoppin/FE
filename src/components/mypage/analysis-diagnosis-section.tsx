import DiagnosisItemCard from "@/components/mypage/diagnosis-item-card";
import { GetAnalysisPageRes } from "@/types/api-response";

interface Props {
  diagnosis: GetAnalysisPageRes["diagnosis"];
}

export default function DiagnosisSection({ diagnosis }: Props) {
  return (
    <section className="mb-1 flex flex-col gap-6">
      <h4 className="h4-bold text-font-basic">지금 바로 바꿔보세요</h4>

      <ul className="flex flex-col gap-6">
        {diagnosis.map((item) => (
          <li key={item.diagnosisId}>
            <DiagnosisItemCard {...item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
