import { Suspense } from "react";
import ReportForm from "@/components/report/report-form";
import FadeMotion from "@/components/common/fade-motion";

export default function Report() {
  return (
    <Suspense fallback={null}>
      <FadeMotion x={20}>
        <ReportForm />
      </FadeMotion>
    </Suspense>
  );
}
