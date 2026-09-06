import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { auth } from "@/auth";
import { Providers } from "@/components/providers";
import { recordAccount } from "@/lib/accounts-store";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Lyra — See if Google and ChatGPT name you",
  description:
    "Look at your website every day. We watch Google, ChatGPT, one rival, and visits. Pay to know what is broken. Call us to fix it.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  if (session?.user?.email) {
    await recordAccount({
      email: session.user.email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      googleId: session.user.googleId ?? null,
      emailVerified: session.user.googleEmailVerified,
    });
  }
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
