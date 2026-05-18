import Image from "next/image";
import Link from "next/link";

export default async function LogoHeader() {
  return (
    <div className="sticky top-0 z-999 flex h-14 w-full items-center justify-center bg-white">
      <Link href="/">
        <Image
          src={"/full-logo.svg"}
          alt="Logo"
          width={104}
          height={20}
          priority
        />
      </Link>
    </div>
  );
}
