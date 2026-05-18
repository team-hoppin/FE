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
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <header className="text-font-middle relative flex h-13 items-center">
      <button
        className="cursor-pointer"
        onClick={handleBack}
        aria-label="뒤로 이동"
      >
        <ChevronLeft size={32} />
      </button>
      {title && (
        <h3 className="h3-bold absolute left-1/2 -translate-x-1/2">{title}</h3>
      )}
    </header>
  );
}
