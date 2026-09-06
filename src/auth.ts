import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/signin",
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
