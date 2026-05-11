import { cookies } from "next/headers";
import ClientHome from "./_client-home";

export default async function Home() {
  const cookieStore = await cookies();

  const showIntro = !cookieStore.has("peak-intro-seen");

  return <ClientHome showIntro={showIntro} />;
}
