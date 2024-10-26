import { Metadata } from "next";
import AnimatedGradientBackground from "@/components/animated-gradient-background";

export const metadata: Metadata = {
  title: "Trimio 4 Barbers",
  description: "Login or sign up for Trimio",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatedGradientBackground>
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </AnimatedGradientBackground>
  );
}
