"use client";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const handleFinish = () => {
    localStorage.setItem("onboarding", "done");
    router.push("/");
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
            새 음원 홍보,
            <br />
            <span className="text-main">어떻게 해야 할지 몰라</span>
            <br />
            막막하셨죠?
          </h1>
          <p className="text-font-middle p2-regular">
            이젠 혼자 하지 마세요.
            <br />
            PEAK가 도와드릴게요!
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
              <div className="embla__slide">
                <div className="inline-flex flex-col gap-2">
                  <div className="bg-grey1 p2-medium relative left-4 rounded-2xl px-4.5 py-3.5 text-left">
                    &quot;홍보는 했는데 팬이 늘었는지 <br />잘 모르겠어요
                    😮‍💨&quot;
                  </div>
                  <div className="bg-grey1 p2-medium relative left-7 rounded-2xl px-4.5 py-3.5 text-left">
                    &quot;뭘 해야 할지 몰라서 그냥 올리고 <br />
                    기다렸어요 😶&quot;
                  </div>
                  <div className="bg-grey1 p2-medium rounded-2xl px-4.5 py-3.5 text-left">
                    &quot;다음엔 뭘 다르게 해야 할지 기준이 <br />
                    없어서 막막해요 😔&quot;
                  </div>
                </div>
              </div>
              <div className="embla__slide">Slide 2</div>
              <div className="embla__slide">Slide 3</div>
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
          {canNext ? "다음" : "시작하기"}
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
