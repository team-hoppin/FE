import { Suspense } from "react";
import ReportDetail from "@/components/report/report-detail";

export default function ReportDetailPage() {
  return (
    <Suspense>
      <ReportDetail />
    </Suspense>
  );
}
