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
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState(workspace.brand);
  const [domain, setDomain] = useState(workspace.domain);
  const [products, setProducts] = useState(workspace.products.join(", "));
  const [error, setError] = useState<string | null>(null);

  function finish() {
    if (!brand.trim() || !domain.trim()) {
      setError("We need the company name and website.");
      setStep(1);
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
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-10 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
          <Compass className="size-3.5" />
        </span>
        <div>
          <p className="font-heading text-lg tracking-tight">Lyra</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {step} of 2
          </p>
        </div>
      </div>

      {step === 1 ? (
        <>
          <h1 className="font-heading text-[2rem] leading-tight tracking-tight">
            Whose site are we watching?
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Name and URL. You land on Look: keywords you already rank for, one
            rival, three AI questions. No homework, no solutions.
          </p>
          <div className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Company</Label>
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
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button className="w-full" size="lg" onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-heading text-[2rem] leading-tight tracking-tight">
            What should people find you for?
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            A few offers, in normal words. We turn them into Google terms and
            ChatGPT questions.
          </p>
          <div className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="products">You sell</Label>
              <Input
                id="products"
                value={products}
                onChange={(e) => setProducts(e.target.value)}
                placeholder="AI product development, automation"
              />
            </div>
            <Button className="w-full" size="lg" onClick={finish}>
              Open today
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
