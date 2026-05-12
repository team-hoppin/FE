import { cookies } from "next/headers";
import Home from "./_client-home";

export default async function Page() {
  const cookieStore = await cookies();

  const showIntro = !cookieStore.has("peak-intro-seen");

  return <Home showIntro={showIntro} />;
}
