"use client";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import AutoHeight from "embla-carousel-auto-height";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Slide = {
  titleBefore: string;
  titleHighlight: string;
  titleAfter?: string;
  description: string;
  src: string;
  imgClassName?: string;
};

const SLIDES: Slide[] = [
  {
    titleBefore: "새 음원 홍보,",
    titleHighlight: "어떻게 해야 할지 몰라",
    titleAfter: "막막하셨죠?",
    description: "이젠 혼자 하지 마세요.\nPEAK가 도와드릴게요!",
    src: "/step01.png",
    imgClassName: "h-auto w-[245px] object-contain",
  },
  {
    titleBefore: "신곡을 냈다면",
    titleHighlight: "홍보 링크를",
    titleAfter: "만들어보세요",
    description:
      "신곡 정보 입력하면 홍보 링크 완성!\n인스타그램 프로필에 딱 붙여두면 돼요.",
    src: "/step02.png",
  },
  {
    titleBefore: "팬이 왜 안 느는지",
    titleHighlight: "PEAK가 찾아드려요",
    description: "링크와 날짜만 입력하면\n홍보 상태를 점검할 수 있어요",
    src: "/step03.png",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
    AutoHeight(),
  ]);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const handleFinish = () => {
    localStorage.setItem("onboarding", "done");
    router.push("/login");
  };
  const handleNext = () => {
    if (canNext) emblaApi?.scrollNext();
    else handleFinish();
  };

  useEffect(() => {
    if (!emblaApi) return;

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());

      setCanNext(emblaApi.canScrollNext());
    };

    onInit();
    onSelect();
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);

    //cleanup
    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);
  return (
    <main className="px-5">
      <div className="mt-20 mb-16 flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col gap-6">
          <h1 className="h1-bold text-font-basic">
            {SLIDES[selectedIndex].titleBefore}
            <br />
            <span className="text-main">
              {SLIDES[selectedIndex].titleHighlight}
            </span>
            <br />
            {SLIDES[selectedIndex].titleAfter}
          </h1>
          <p className="text-font-middle p2-semibold">
            {SLIDES[selectedIndex].description.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>
        <>
          {/* Carousel */}
          <div
            className="embla__viewport"
            ref={emblaRef}
            onMouseEnter={() => emblaApi?.plugins()?.autoplay?.stop()}
            onMouseLeave={() => emblaApi?.plugins()?.autoplay?.play()}
          >
            <div className="embla__container">
              {SLIDES.map((slide, index) => (
                <div key={index} className="embla__slide">
                  <div className="flex items-start justify-center">
                    <Image
                      src={slide.src}
                      alt="설명 이미지"
                      width={244}
                      height={244}
                      className={
                        slide.imgClassName ?? "h-auto w-70 object-contain"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="embla__dots flex gap-3">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`embla__dot cursor-pointer ${
                  index === selectedIndex ? "embla__dot--selected" : ""
                }`}
              />
            ))}
          </div>
        </>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          variant="btnPurple"
          size="full"
          className="embla__next"
          onClick={handleNext}
        >
          다음
        </Button>
        <button
          className="text-font-light p2-semibold cursor-pointer"
          onClick={handleFinish}
        >
          건너뛰기
        </button>
      </div>
    </main>
  );
}
