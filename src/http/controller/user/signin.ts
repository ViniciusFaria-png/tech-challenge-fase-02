import { makeSigninUseCase } from "@/use-cases/factory/make-signin-use-case";
import { compare } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function signin(request: FastifyRequest, reply: FastifyReply)
{
    try {
        console.log("Received request for user sign-in:", request.body);
        
        const registerBodySchema = z.object({   
            email: z.string().email("Invalid email format."),
            password: z.string().min(6, "Password must be at least 6 characters long."),
        });
    

        const {email, password} = registerBodySchema.parse(request.body);
        
        // Assuming you have a use case to handle the sign-in logic
        const signinUseCase = makeSigninUseCase();
        const result = await signinUseCase.execute( email, password );
        
        const doesMathPassword = await compare(password, result.senha);
        
        if (!doesMathPassword) {
            return reply.status(401).send({ message: "Invalid email or password." });
        }
        
        const token = await reply.jwtSign({
            email: result.email,        
        })

        return reply.status(200).send({ token: token });
    } catch (err) {
        console.log("Error during user sign-in:", err);
        throw err; // This will be caught by the global error handler
    }
}

export const registerBodySchema ={
    summary: "User Sign-in",
    tags: ["User"],
    body: {
        type: "object",
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 4 },
        },
        required: ["email", "password"],
    },
    response: {
        200: {
            type: "object",
            properties: {
                token: { type: "string" },
            },
        },
        401: {
            type: "object",
            properties: {
                message: { type: "string" },
            },
        },
    },
}