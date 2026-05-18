"use client";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FadeMotion from "@/components/common/fade-motion";

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
    titleBefore: "새 앨범 홍보,",
    titleHighlight: "어떻게 해야 할지 몰라",
    titleAfter: "막막하셨죠?",
    description: "이젠 혼자 하지 마세요.\nPEAK가 도와드릴게요!",
    src: "/tutorial/step01.png",
    imgClassName: "w-[216px]",
  },
  {
    titleBefore: "신곡을 냈다면",
    titleHighlight: "홍보 링크를",
    titleAfter: "만들어보세요",
    description:
      "앨범 정보 입력하면 홍보 페이지 완성!\n페이지 링크를 복사해서\n인스타그램 프로필에 딱 붙여두면 돼요.",
    src: "/tutorial/step02.png",
    imgClassName: "w-[280px]",
  },
  {
    titleBefore: "팬이 왜 안 느는지",
    titleHighlight: "PEAK가 찾아드려요",
    description: "진단 받기를 누르면\n홍보 현황부터 해결책까지 알려줘요",
    src: "/tutorial/step03.png",
    imgClassName: "w-auto h-full",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    watchDrag: false,
  });
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canNext, setCanNext] = useState(false);

  const handleFinish = () => {
    document.cookie = "onboarding=done; path=/; max-age=31536000";
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

    return () => {
      emblaApi.off("reInit", onInit);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <FadeMotion>
      <main className="flex flex-1 flex-col px-5 pb-9">
        <div className="mt-16 flex flex-1 flex-col items-center gap-10 text-center">
          <div className="flex flex-col">
            <div
              className="embla__viewport w-full overflow-hidden"
              ref={emblaRef}
            >
              <div className="embla__container">
                {SLIDES.map((slide, index) => (
                  <div
                    key={index}
                    className="embla__slide flex flex-col items-center gap-3"
                  >
                    <div className="flex flex-col gap-3">
                      <h1 className="h1-bold text-font-basic">
                        {slide.titleBefore}
                        <br />
                        <span className="text-main">
                          {slide.titleHighlight}
                        </span>
                        {slide.titleAfter && (
                          <>
                            <br />
                            {slide.titleAfter}
                          </>
                        )}
                      </h1>
                      <p className="text-font-light p2-semibold">
                        {slide.description.split("\n").map((line, i) => (
                          <span key={i}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                    <div className="flex min-h-85 items-center justify-center">
                      <Image
                        src={slide.src}
                        alt="설명 이미지"
                        width={244}
                        height={244}
                        className={slide.imgClassName}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="embla__dots flex justify-center gap-3">
              {scrollSnaps.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => emblaApi?.scrollTo(dotIndex)}
                  className={`embla__dot cursor-pointer ${dotIndex === selectedIndex ? "embla__dot--selected" : ""}`}
                />
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
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
        </div>
      </main>
    </FadeMotion>
  );
}
