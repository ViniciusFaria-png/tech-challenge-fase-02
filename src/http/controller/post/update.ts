import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeUpdatePostUseCase } from "@/use-cases/factory/make-update-post-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const updatePostParamsSchema = z.object({
  id: z.string().uuid("Invalid post ID format."),
});

const updatePostBodySchema = z
  .object({
    titulo: z.string().min(1, "Title cannot be empty.").optional(),
    resumo: z.string().optional(),
    conteudo: z.string().min(1, "Content cannot be empty.").optional(),
    professor_id: z.number().int().positive().optional(),
  })
  .partial();

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updatePostParamsSchema.parse(request.params);
  const data = updatePostBodySchema.parse(request.body);

  if (Object.keys(data).length === 0) {
    return reply
      .status(400)
      .send({ message: "No fields provided for update." });
  }

  try {
    const updatePostUseCase = makeUpdatePostUseCase();
    const { post } = await updatePostUseCase.execute({
      postId: id,
      ...data,
    });

    return reply.status(200).send({ post });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}

export const updatePostSchema = {
  summary: "Update an existing post",
  tags: ["Posts"],
  params: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
    },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      titulo: { type: "string", minLength: 1 },
      resumo: { type: "string" },
      conteudo: { type: "string", minLength: 1 },
      professor_id: { type: "number", minimum: 1 },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        post: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            titulo: { type: "string" },
            resumo: { type: "string", nullable: true },
            conteudo: { type: "string" },
            professor_id: { type: "number" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "titulo",
            "conteudo",
            "professor_id",
            "created_at",
            "updated_at",
          ],
        },
      },
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string" },
        issues: { type: "object" },
      },
    },
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Resource not found." },
      },
    },
  },
};
