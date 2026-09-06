import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const insecureCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: false,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // PKCE cookies break in the Cursor preview proxy. Web clients can use state.
      checks: ["state"],
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  cookies: {
    state: { name: "authjs.state", options: insecureCookie },
    callbackUrl: { name: "authjs.callback-url", options: { ...insecureCookie, httpOnly: false } },
    csrfToken: { name: "authjs.csrf-token", options: insecureCookie },
    sessionToken: { name: "authjs.session-token", options: insecureCookie },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.providerAccountId) {
        token.googleId = String(account.providerAccountId);
      }
      if (profile && "email_verified" in profile) {
        token.googleEmailVerified = Boolean(profile.email_verified);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.googleId = typeof token.googleId === "string" ? token.googleId : null;
        session.user.googleEmailVerified = Boolean(token.googleEmailVerified);
      }
      return session;
    },
  },
});
