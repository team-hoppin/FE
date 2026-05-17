import { Suspense } from "react";
import AlbumPage from "@/components/album/album-page";
import FadeMotion from "@/components/common/fade-motion";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FadeMotion x={20}>
        <AlbumPage />
      </FadeMotion>
    </Suspense>
  );
}
