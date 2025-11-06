import bcrypt from "bcryptjs";
import NextAuth, { User, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { prisma } from "./prisma";
import { LoginSchema } from "./schemas";

// 🧩 Mở rộng type NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      phone?: string | null;
      addressLine1?: string | null;
      province?: string | null;
      district?: string | null;
      ward?: string | null;
      avatarUrl?: string | null;
    };
    refreshedAt?: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
    addressLine1?: string | null;
    province?: string | null;
    district?: string | null;
    ward?: string | null;
    avatarUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
    addressLine1?: string | null;
    province?: string | null;
    district?: string | null;
    ward?: string | null;
    avatarUrl?: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Custom Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 🧠 Validate input bằng Zod schema
        const parsedCredentials = LoginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error);
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // 🔍 Tìm user trong Prisma
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          console.error("User not found:", email);
          return null;
        }

        // 🔑 So sánh password
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          console.error("Invalid password");
          return null;
        }

        // ✅ Trả về dữ liệu user cho NextAuth
        return {
          id: user.id,
          name: user.name ?? "",
          email: user.email,
          role: user.role,
          phone: user.phone ?? null,
          addressLine1: user.addressLine1 ?? null,
          province: user.province ?? null,
          district: user.district ?? null,
          ward: user.ward ?? null,
          avatarUrl: user.avatarUrl ?? null,
        };
      },
    }),
  ],

  // ⚙️ Callbacks để đồng bộ JWT ↔ Session
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        // Đăng nhập lần đầu
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.phone = user.phone ?? null;
        token.addressLine1 = user.addressLine1 ?? null;
        token.avatarUrl = user.avatarUrl ?? null;
      }

      // ✅ Xử lý khi gọi `update()` từ client
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            name: true,
            phone: true,
            addressLine1: true,
            avatarUrl: true,
            email: true,
            role: true,
          },
        });

        if (dbUser) {
          token.name = dbUser.name ?? "";
          token.phone = dbUser.phone ?? null;
          token.addressLine1 = dbUser.addressLine1 ?? null;
          token.avatarUrl = dbUser.avatarUrl ?? null;
          // (email, role thường không đổi, nhưng vẫn đồng bộ để an toàn)
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.phone = token.phone ?? null;
        session.user.addressLine1 = token.addressLine1 ?? null;
        session.user.avatarUrl = token.avatarUrl ?? null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
});

// 🧱 Hàm hỗ trợ mã hoá & so sánh mật khẩu
export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return await bcrypt.compare(password, hashedPassword);
}
