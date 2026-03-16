"use client";

import { useEffect } from "react";
import { useWeddingStore } from "@/store/wedding-store";
import { Loader2 } from "lucide-react";

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useWeddingStore((s) => s.hydrate);
  const isLoading = useWeddingStore((s) => s.isLoading);
  const isHydrated = useWeddingStore((s) => s.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-vermillion" />
          <p className="text-sm text-muted-foreground">Loading wedding data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
