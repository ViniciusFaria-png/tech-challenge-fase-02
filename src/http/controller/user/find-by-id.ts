import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeFindUserByIdUseCase } from "@/use-cases/factory/user/make-find-user-by-id-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import {  z } from "zod";

const findUserParamsSchema = z.object({
  id: z.uuid("Invalid user ID format."),
});

export async function findByIdUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = findUserParamsSchema.parse(request.params);

    const findUserByIdUseCase = makeFindUserByIdUseCase();
    const { user } = await findUserByIdUseCase.execute({ userId: id });

    return reply.status(200).send({ user });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Validation error.",
        issues: err.issues,
      });
    }
    throw err;
  }
}

export const findByIdUserSchema = {
  summary: "Get a user by ID",
  tags: ["Users"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
    },
    required: ["id"],
  },
  response: {
    200: {
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
            senha: { type: "string"},
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
          type: "array",
          items: {
            type: "object",
            properties: {
              code: { type: "string" },
              expected: { type: "string" },
              received: { type: "string" },
              path: { type: "array", items: { type: "string" } },
              message: { type: "string" },
            },
            required: ["code", "expected", "received", "path", "message"],
          },
        },
      },
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Resource not found" },
      },
    },
  },
};
