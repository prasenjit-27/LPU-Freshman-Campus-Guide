import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
export const authOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      credentials: { email: {}, password: {} },
      async authorize(c) {
        if (!c?.email || !c?.password) return null;
        const user = await (await getDb()).collection("users").findOne({ email: c.email.trim().toLowerCase() });
        if (!user || !(await bcrypt.compare(c.password, user.passwordHash))) return null;
        return { id: String(user._id), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) { if (user) { token.id = user.id; token.role = user.role; } return token; },
    session({ session, token }) { session.user.id = token.id; session.user.role = token.role; return session; },
  },
};
