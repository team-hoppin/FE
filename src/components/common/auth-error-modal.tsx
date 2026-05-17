"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAlertModal } from "@/stores/alert-modal-store";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import FadeMotion from "./fade-motion";

export default function AuthErrorModal() {
  const store = useAlertModal();
  const router = useRouter();

  if (!store.isOpen || store.variant !== "auth-error") return null;

  const handleMain = () => {
    store.actions.close();
    router.push("/");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      localStorage.removeItem("accessToken");
      store.actions.close();
      router.push("/login");
    }
  };

  return (
    <FadeMotion className="z-9999">
      <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 px-5">
        <div
          role="dialog"
          aria-modal="true"
          className="rounded-r3 flex w-full max-w-87.5 flex-col items-center gap-2.5 bg-white px-5 py-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex w-full flex-col gap-2">
            <h6 className="h3-bold text-font-basic whitespace-pre-line">
              {store.message}
            </h6>
            {store.description && (
              <p className="p2-semibold text-font-light whitespace-pre-line">
                {store.description}
              </p>
            )}
          </div>
          <Image
            src="/character/modal-warning.png"
            alt="auth-error"
            width={189}
            height={140}
          />
          <div className="flex w-full gap-3">
            <Button
              variant="btnWhite"
              size="md"
              className="w-auto flex-1"
              onClick={handleMain}
            >
              메인으로 가기
            </Button>
            <Button
              variant="btnPurple"
              size="md"
              className="w-auto flex-1"
              onClick={handleLogout}
            >
              로그아웃 하기
            </Button>
          </div>
        </div>
      </div>
    </FadeMotion>
  );
}
