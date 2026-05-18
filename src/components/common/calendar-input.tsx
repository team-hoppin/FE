"use client";

import { Input } from "@/components/common/input";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "radix-ui";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";

interface Props {
  label?: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

export default function CalendarInput({
  label,
  value,
  onChange,
  placeholder = "YYYY.MM.DD",
  error = false,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  // 캘린더 내부에서 사용하는 임시 날짜
  const [tempDate, setTempDate] = useState<Date | undefined>();

  const handleOpen = () => {
    setTempDate(value);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={handleOpen}>
          <Input
            readOnly
            label={label}
            placeholder={placeholder}
            value={value ? format(value, "yyyy.MM.dd") : ""}
            className={cn(
              error && "border-danger focus-visible:ring-danger",
              className
            )}
            iconBtn={
              <div className="flex cursor-pointer items-center justify-center">
                <CalendarIcon size={24} />
              </div>
            }
          />
        </div>
      </DialogTrigger>

      <DialogContent
        className="flex max-w-2xs flex-col p-0"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        {/* Radix Dialog 접근성 관련 콘솔 에러 지우기 위함 */}
        <VisuallyHidden.Root>
          <DialogTitle>날짜 선택</DialogTitle>
        </VisuallyHidden.Root>

        <Calendar
          mode="single"
          selected={tempDate}
          onSelect={setTempDate}
          className="w-full"
        />

        <DialogFooter className="flex-row justify-center gap-2 px-4 pt-2 pb-4">
          <Button variant="btnWhite" size="mini" onClick={handleCancel}>
            취소
          </Button>

          <Button variant="btnPurple" size="mini" onClick={handleConfirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
