import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeDeleteProfessorUseCase } from "@/use-cases/factory/make-delete-professor-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const deleteProfessorParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = deleteProfessorParamsSchema.parse(request.params);

    const deleteProfessorUseCase = makeDeleteProfessorUseCase();
    await deleteProfessorUseCase.execute({ professorId: id });

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

export const deleteProfessorSchema = {
  summary: "Delete a professor by ID",
  tags: ["Professors"],
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
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
