"use client";
//components/animated-gradient-background.tsx

import React from "react";

export default function AnimatedGradientBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent animate-gradient-x"></div>
      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}
