"use client";

import { Button } from "@/components/ui/button";
import { TriangleAlertIcon } from "lucide-react";
import { useAlertModal } from "@/stores/alert-modal-store";

export default function AlertModal() {
  const store = useAlertModal();

  if (!store.isOpen) return null;

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
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-6 py-5 text-center">
        <TriangleAlertIcon className="text-main" size={28} />

        <p className="p2-regular text-font-middle whitespace-pre-line">
          {store.message}
        </p>

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
