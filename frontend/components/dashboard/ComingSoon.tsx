"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Construction } from "lucide-react";

export default function ComingSoonPage() {
  const pathname = usePathname();
  const pageName = pathname.split("/").pop()?.replace("-", " ") || "Page";

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-in zoom-in duration-500">
      <Card className="max-w-md w-full border-dashed border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-12 text-center space-y-6">
          <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
            <Construction className="size-12 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {pageName} <span className="text-primary">Coming Soon</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            We're working hard to bring you the best hiring experience. Stay
            tuned for updates!
          </p>
          <div className="flex items-center justify-center gap-2 text-primary font-medium">
            <Sparkles className="size-5" />
            <span>Building HireLoop...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
