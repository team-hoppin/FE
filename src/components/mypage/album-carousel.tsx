"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AlbumDetail from "@/components/album/album-detail";
import { StreamingCode } from "@/types/album";

export interface AlbumData {
  id: string;
  coverUrl: string;
  title: string;
  artist: string;
  releaseDate: string;
  streamingCodes: readonly StreamingCode[];
  message: string;
  link: string;
}

interface Props {
  albums: AlbumData[];
  onSelect: (album: AlbumData) => void;
}

export default function AlbumCarousel({ albums, onSelect }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onInit = () => setScrollSnaps(emblaApi.scrollSnapList());
    const onSelectSnap = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
      onSelect(albums[index]);
    };

    onInit();
    onSelectSnap();
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelectSnap);

    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("select", onSelectSnap);
    };
  }, [emblaApi, albums, onSelect]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl p-6 shadow-(--shadow-img)">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {albums.map((album) => (
              <div key={album.id} className="embla__slide">
                <AlbumDetail
                  coverUrl={album.coverUrl}
                  title={album.title}
                  artist={album.artist}
                  releaseDate={album.releaseDate}
                  streamingCodes={album.streamingCodes}
                  message={album.message}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {scrollSnaps.length > 1 && (
        <div className="embla__dots flex justify-center gap-3">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`embla__dot cursor-pointer ${index === selectedIndex ? "embla__dot--selected" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
