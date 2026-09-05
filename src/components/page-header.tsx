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
      <h1 className="font-heading text-3xl tracking-tight text-foreground sm:text-[2rem]">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}
