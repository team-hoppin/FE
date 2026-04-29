"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  withdrawnAt?: string;
}

export default function LoginErrorToast({ withdrawnAt }: Props) {
  useEffect(() => {
    const message = withdrawnAt
      ? `${withdrawnAt}에 탈퇴처리된 계정입니다. 90일 이후 재가입 가능합니다.`
      : "탈퇴처리된 계정입니다. 90일 이후 재가입 가능합니다.";
    toast.error(message, { duration: 5000 });
  }, [withdrawnAt]);

  return null;
}
