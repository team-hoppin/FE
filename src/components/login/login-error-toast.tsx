"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function LoginErrorToast() {
  useEffect(() => {
    toast.error("탈퇴 처리된 계정입니다. 90일 이후 재가입 가능합니다.", {
      duration: 5000,
    });
  }, []);

  return null;
}
