import { Metadata } from "next";
import AnimatedGradientBackground from "@/components/animated-gradient-background";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Login or sign up for Trimio",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatedGradientBackground>
      <div className="container flex items-center justify-center min-h-screen px-4 py-12">
        {children}
      </div>
    </AnimatedGradientBackground>
  );
}
