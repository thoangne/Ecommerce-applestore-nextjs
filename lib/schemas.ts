import {  z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters",
    }),
})

export const RegisterSchema = LoginSchema.extend({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters",
    }), 
    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters",
    })
    
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
// LoginSchema.parse({
//     email: "test@me.com",
//     password: "password",
// })

export type LoginSchemaType = z.infer<typeof LoginSchema>
export type RegisterSchemaType = z.infer<typeof RegisterSchema>