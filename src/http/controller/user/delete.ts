import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeDeleteUserUseCase } from "@/use-cases/factory/user/make-delete-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

const deleteUserParamsSchema = z.object({
  id: z.uuid("Invalid user ID format."),
});

export async function removeUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = deleteUserParamsSchema.parse(request.params);

    const deleteUserUseCase = makeDeleteUserUseCase();
    await deleteUserUseCase.execute({ userId: id });

    return reply.status(204).send();
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

export const deleteUserSchema = {
  summary: "Delete a user by ID",
  tags: ["Users"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
    },
    required: ["id"],
  },
  response: {
    204: {
      type: "null",
      description: "No content",
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
