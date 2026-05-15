import Header from "@/components/common/header";
import { MotionLayout } from "@/components/common/fade-motion";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <MotionLayout>{children}</MotionLayout>
    </>
  );
}
