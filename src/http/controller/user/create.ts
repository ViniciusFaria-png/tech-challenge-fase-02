import { makeCreateUserUseCase } from "@/use-cases/factory/user/make-create-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const createUserBodySchema = z.object({
  email: z.string().min(1, "E-mail is required."),
  senha: z.string().min(1, "Senha is required."),
});

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email, senha} = createUserBodySchema.parse(
      request.body
    );

    const createUserUseCase = makeCreateUserUseCase();
    const { user } = await createUserUseCase.execute({
      email,
      senha
    });

    return reply.status(201).send({ user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Validation error.",
        issues: err.issues,
      });
    }
    throw err;
  }
}

export const createUserSchema = {
  summary: "Create a new user",
  tags: ["Users"],
  body: {
    type: "object",
    properties: {
      email: { type: "string", minLength: 1 },
      senha: { type: "string" }
    },
    required: ["email", "senha"],
  },
  response: {
    201: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Generated UUID for the user",
            },
            email: { type: "string" },
            senha: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "email",
            "senha",
            "created_at",
            "updated_at",
          ],
        },
      },
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "object",
          description: "Details about validation errors",
        },
      },
    }
  },
};
