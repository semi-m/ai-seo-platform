import Link from "next/link";

export function SampleNotice() {
  return (
    <p className="mb-6 text-[13px] leading-relaxed text-muted-foreground">
      These numbers are a sample company, so you can learn the rooms. They are
      not your Google or ChatGPT yet.{" "}
      <Link href="/connections" className="text-foreground underline-offset-4 hover:underline">
        Connect when you want live data
      </Link>
      .
    </p>
  );
}
