import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorViewProps {
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export default function ErrorView({
  title,
  description,
  linkHref = "/",
  linkLabel = "메인으로 이동하기",
  onAction,
  actionLabel = "다시 시도하기",
}: ErrorViewProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between pt-46.5 pb-30 text-center whitespace-pre-line">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center">
            <Image
              src={"/character/page-notfound.png"}
              alt="죄송한 피크"
              width={220}
              height={174}
            />
          </div>
          <h1 className="h1-bold">{title}</h1>
          {description && (
            <p className="text-font-middle p2-regular">{description}</p>
          )}
        </div>
      </div>
      {onAction ? (
        <Button variant="btnPurple" size="full" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : (
        <Button asChild variant="btnPurple" size="full">
          <Link href={linkHref}>{linkLabel}</Link>
        </Button>
      )}
    </div>
  );
}
