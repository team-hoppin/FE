"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAlertModal } from "@/stores/alert-modal-store";

const VARIANT_IMAGE: Record<"warning" | "danger", string> = {
  warning: "/character/modal-warning.png",
  danger: "/character/modal-danger.png",
};

export default function AlertModal() {
  const store = useAlertModal();

  if (!store.isOpen || store.variant === "mail-success" || store.variant === "auth-error") return null;

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
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50"
      onClick={handleCancelClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex min-w-82.5 flex-col items-center gap-2.5 rounded-2xl bg-white px-6 py-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p2-regular text-font-basic text-center whitespace-pre-line">
          {store.message}
        </div>
        <Image
          src={VARIANT_IMAGE[store.variant]}
          alt={store.variant}
          width={120}
          height={95}
        />

        <div className="flex gap-1">
          {isConfirm && (
            <Button variant="btnWhite" size="mini" onClick={handleCancelClick}>
              취소
            </Button>
          )}

          <Button variant="btnPurple" size="mini" onClick={handleActionClick}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
