"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  href?: string;
  title?: string;
}

export default function BackButton({ href, title }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href && window.history.length <= 1) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <div className="relative flex h-14 items-center">
      <button className="cursor-pointer" onClick={handleBack} aria-label="뒤로 이동">
        <ChevronLeft size={32} />
      </button>
      {title && (
        <h3 className="h3-bold absolute left-1/2 -translate-x-1/2">{title}</h3>
      )}
    </div>
  );
}
