import ClientReportDetail from "@/components/report/report-detail";

interface Props {
  params: Promise<{ promotionId: string }>;
  searchParams: Promise<{ diagnosisId?: string }>;
}

export default async function ReportDetailPage({ params, searchParams }: Props) {
  const { promotionId } = await params;
  const { diagnosisId } = await searchParams;

  return (
    <ClientReportDetail
      promotionId={Number(promotionId)}
      diagnosisId={diagnosisId ? Number(diagnosisId) : undefined}
    />
  );
}
