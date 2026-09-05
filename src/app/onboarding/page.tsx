"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/lib/workspace-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, workspace } = useWorkspace();
  const [brand, setBrand] = useState(workspace.brand);
  const [domain, setDomain] = useState(workspace.domain);
  const [products, setProducts] = useState(workspace.products.join(", "));
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!brand.trim() || !domain.trim()) {
      setError("Brand and domain are required.");
      return;
    }
    completeOnboarding({
      brand: brand.trim(),
      domain: domain.trim(),
      products: products.split(",").map((p) => p.trim()).filter(Boolean),
    });
    router.push("/overview");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Compass className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium">Atlas</p>
          <p className="text-xs text-muted-foreground">Discoverability intelligence</p>
        </div>
      </div>

      <h1 className="font-heading text-3xl tracking-tight">
        How discoverable is this business?
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        Enter a brand. V1 loads a complete Northline demo so you can judge the
        product — live GSC, rank, and AI collectors plug in later behind the same
        screens.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="brand">Brand name</Label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Northline"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="domain">Website</Label>
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="northline.ai"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="products">Products or services</Label>
          <Input
            id="products"
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            placeholder="AI product development, AI SaaS"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated. Used to seed the keyword and prompt universe.
          </p>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-full">
          Generate first report
        </Button>
      </form>
    </div>
  );
}
