"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAlertModal } from "@/stores/alert-modal-store";
import FadeMotion from "./fade-motion";

export default function MailSuccessModal() {
  const store = useAlertModal();

  if (!store.isOpen || store.variant !== "mail-success") return null;

  const isConfirm = store.type === "confirm";

  const handleCancelClick = () => {
    if (store.onCancel) store.onCancel();
    store.actions.close();
  };

  const handleActionClick = () => {
    if (store.onAction) store.onAction();
    store.actions.close();
  };

  return (
    <FadeMotion className="z-9999">
      <div
        className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 px-5"
        onClick={handleCancelClick}
      >
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
            src="/character/modal-mail-success.png"
            alt="mail-success"
            width={189}
            height={140}
          />

          <div className="flex w-full gap-3">
            {isConfirm && (
              <Button
                variant="btnWhite"
                size="md"
                className="w-auto flex-1"
                onClick={handleCancelClick}
              >
                나중에 볼게요
              </Button>
            )}

            <Button
              variant="btnPurple"
              size="md"
              className="w-auto flex-1"
              onClick={handleActionClick}
            >
              확인하러 가기
            </Button>
          </div>
        </div>
      </div>
    </FadeMotion>
  );
}
