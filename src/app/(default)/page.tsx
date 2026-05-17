import { cookies } from "next/headers";
import Home from "@/components/home/home-page";
import FadeMotion from "@/components/common/fade-motion";

export default async function Page() {
  const cookieStore = await cookies();

  const showIntro = !cookieStore.has("peak-intro-seen");
  const isLoggedIn = cookieStore.has("isLoggedIn");

  return (
    <FadeMotion>
      <Home showIntro={showIntro} isLoggedIn={isLoggedIn} />
    </FadeMotion>
  );
}
