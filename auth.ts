import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_EMAILS = ["kontakt.mateuszwojdas@gmail.com"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    signIn({ user }) {
      if (!user.email || !ALLOWED_EMAILS.includes(user.email)) {
        return "/login?error=AccessDenied";
      }
      return true;
    },
    session({ session }) {
      return session;
    },
  },
});
