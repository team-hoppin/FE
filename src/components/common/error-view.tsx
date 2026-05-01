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
  linkLabel = "메인으로 이동",
  onAction,
  actionLabel,
}: ErrorViewProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-around text-center whitespace-pre-line">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col gap-14">
          <h1 className="h1-bold">{title}</h1>
          {description && (
            <p className="text-font-middle p2-regular">{description}</p>
          )}
        </div>
        <div className="bg-grey2 flex h-44 w-44 items-center justify-center rounded-full">
          <Image src={"/bamti-sad.svg"} alt="" width={128} height={128} />
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
