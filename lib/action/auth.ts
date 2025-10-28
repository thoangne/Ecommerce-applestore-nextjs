"use server";
import { hashPassword } from "../auth";
import { prisma } from "../prisma";
import { RegisterSchema, RegisterSchemaType } from "../schemas";

export async function registerUser(data: RegisterSchemaType) {
    const validationResult = RegisterSchema.safeParse(data);
    if(!validationResult.success) {
        return {
            success: false,
            error: "Invalid email or password.",
            issue: validationResult.error.flatten().fieldErrors
        };
    }
    const { email, password, name } = validationResult.data;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return {
                success: false,
                error: "User already exists.",
            };
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: "user",
            },
        });

        const userWithoutPassword = {
            id: newUser.id,
            name: newUser.name ?? "",
            email: newUser.email,
            role: newUser.role,
        }
        return {
            success: true,
            user: userWithoutPassword
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return {
            sucess:false,
            error: "An error occurred while creating the user."
        }
    }

    
}
