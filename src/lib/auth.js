import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { loginSchema } from "@/lib/validation";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        // Enforce strict Zod schema validation
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          const errMsg = parsed.error.issues[0]?.message || "Invalid credentials format.";
          throw new Error(errMsg);
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.trim().toLowerCase();

        const db = await getDb();
        const user = await db.collection("users").findOne({ email: normalizedEmail });
        if (!user || !user.passwordHash) return null;
        
        // Disallow disabled/deactivated accounts
        if (user.status === "deactivated" || user.status === "disabled") {
          throw new Error("Account has been deactivated. Please contact an administrator.");
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        // Record last login timestamp asynchronously
        db.collection("users").updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } }).catch(() => {});

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role || "student",
          status: user.status || "active",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.status = token.status;
      }
      return session;
    },
  },
};
