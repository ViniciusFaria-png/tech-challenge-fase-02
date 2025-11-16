import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeUpdateProfessorUseCase } from "@/use-cases/factory/make-update-professor-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const updateProfessorParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

const updateProfessorBodySchema = z
  .object({
    nome: z.string().min(1, "Name cannot be empty.").optional(),
    materia: z.string().min(1, "Subject cannot be empty.").optional(),
    user_id: z.number().int().positive().optional(),
  })
  .partial();

export async function update(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = updateProfessorParamsSchema.parse(request.params);
    const data = updateProfessorBodySchema.parse(request.body);
    const updateProfessorUseCase = makeUpdateProfessorUseCase();
    const { professor } = await updateProfessorUseCase.execute({
      professorId: id,
      ...data,
    });

    return reply.status(200).send({ professor });
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

export const updateProfessorSchema = {
  summary: "Update a professor by ID",
  tags: ["Professors"],
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      nome: { type: "string", minLength: 1 },
      materia: { type: "string", minLength: 1 },
      user_id: { type: "number", minimum: 1 },
    },
    minProperties: 1,
  },
  response: {
    200: {
      type: "object",
      properties: {
        professor: {
          type: "object",
          properties: {
            id: { type: "number" },
            nome: { type: "string" },
            materia: { type: "string" },
            user_id: { type: "number" },
          },
          required: ["id", "nome", "materia", "user_id"],
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
