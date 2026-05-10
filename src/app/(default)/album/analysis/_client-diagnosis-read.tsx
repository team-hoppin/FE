"use client";

import { useEffect } from "react";
import { patchDiagnosisRead } from "@/lib/api/music-promotion";

interface Props {
  promotionId: number;
}

export default function ClientDiagnosisRead({ promotionId }: Props) {
  useEffect(() => {
    patchDiagnosisRead(promotionId);
  }, [promotionId]);

  return null;
}
