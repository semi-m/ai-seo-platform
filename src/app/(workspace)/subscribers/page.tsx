import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageHeader } from "@/components/page-header";
import { isFounderEmail, listSignups } from "@/lib/accounts-store";
import { planById } from "@/lib/tiers";

export default async function SubscribersPage() {
  const session = await auth();
  if (!isFounderEmail(session?.user?.email)) {
    redirect("/overview");
  }

  const { accounts, waitlist } = await listSignups();

  return (
    <div>
      <PageHeader
        eyebrow="Signups"
        title="Accounts and the Watch / Fix list"
        description="Every Google login and every Watch / Fix notify-me, from the database."
      />

      <section className="border-y border-border py-8">
        <h2 className="font-heading text-xl tracking-tight">
          Google accounts · {accounts.length}
        </h2>
        {accounts.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No one has signed in yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {accounts.map((item) => (
              <li key={item.email} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium">{item.name || "No name"}</p>
                  <p className="text-xs text-muted-foreground">{item.email}</p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="py-8">
        <h2 className="font-heading text-xl tracking-tight">
          Notify me · {waitlist.length}
        </h2>
        {waitlist.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nobody has asked for Watch or Fix yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {waitlist.map((item) => (
              <li
                key={`${item.email}-${item.plan}-${item.createdAt}`}
                className="flex flex-wrap items-baseline justify-between gap-2 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{item.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {planById[item.plan].name}
                    {item.name ? ` · ${item.name}` : ""}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
