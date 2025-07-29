import { makeSigninUseCase } from "@/use-cases/factory/make-signin-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function signin(request: FastifyRequest, reply: FastifyReply)
{
    try {
        console.log("Received request for user sign-in:", request.body);
        
        const registerBodySchema = z.object({   
            email: z.string().email("Invalid email format."),
            senha: z.string().min(6, "Password must be at least 6 characters long."),
        });
    

        const {email, senha} = registerBodySchema.parse(request.body);
        
        // Assuming you have a use case to handle the sign-in logic
        const signinUseCase = makeSigninUseCase();
        const result = await signinUseCase.execute( email, senha );
        
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
            senha: { type: "string", minLength: 6 },
        },
        required: ["email", "senha"],
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