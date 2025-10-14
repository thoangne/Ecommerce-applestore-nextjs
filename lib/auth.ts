import bcrypt from "bcryptjs";
import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { prisma } from './prisma';
import { Session } from "next-auth";
import {JWT} from "next-auth/jwt";
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            
        },
        refreshedAt?: string;
    }

    interface User{
        id: string;
        name: string;
        email: string;
        role: string;
    }
}

declare module "next-auth/jwt" {    
    interface JWT {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Custom Login",
            credentials: {
                email: {
                   
                },
                password: {
                   
                },
            },
        async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
            console.error("Invalid credentials:", parsedCredentials.error);
            return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
            const user = await prisma.user.findUnique({
            where: { email },
            });

            if (!user) {
            console.error("User not found");
            return null;
            }

            const passwordsMatch = await comparePassword(password, user.password);
            if (!passwordsMatch) {
            console.error("Invalid password");
            return null;
            }

            // ⚡ Chỉ trả về các field mà NextAuth User cần
            return {
                id: user.id,
                name: user.name ?? "", // ép null -> string
                email: user.email,
                role: user.role,
                };            
            //   id: user.id.toString(),
            //   name: user.name,
            //   email: user.email,
            

        } catch (error) {
            console.error("Error finding user:", error);
            return null; // ✅ tránh undefined
        }
        }})
            ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User }) {
            if (user) {
                token.id = user.id; 
                token.role = user.role;
            }
            return token;
        }, async session({ session, token }:{session:Session;token:JWT}) {
            if (session.user) {
                session.user.id = token.id ;
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
    }
})

export async function hashPassword(password:string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(
    password: string,
    hashedPassword: string
) {
    return await bcrypt.compare(password, hashedPassword);
}

