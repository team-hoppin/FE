import { Suspense } from "react";
import AlbumPage from "./_client-album-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AlbumPage />
    </Suspense>
  );
}
