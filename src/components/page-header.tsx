export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6 max-w-3xl">
      {eyebrow ? (
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-heading text-[2rem] leading-[1.15] tracking-tight text-foreground sm:text-[2.25rem]">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-foreground/75">
          {description}
        </p>
      ) : null}
    </header>
  );
}
