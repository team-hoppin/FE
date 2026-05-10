import { Suspense } from "react";
import ReportForm from "@/components/report/report-form";

export default function Report() {
  return (
    <Suspense fallback={null}>
      <ReportForm />
    </Suspense>
  );
}
