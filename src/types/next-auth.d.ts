import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      googleId?: string | null;
      googleEmailVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleId?: string;
    googleEmailVerified?: boolean;
  }
}
