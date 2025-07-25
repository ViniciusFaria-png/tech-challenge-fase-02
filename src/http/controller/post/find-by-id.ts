import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeFindPostByIdUseCase } from "@/use-cases/factory/make-find-post-by-id-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const findPostParamsSchema = z.object({
  id: z.string().uuid("Invalid post ID format."),
});

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = findPostParamsSchema.parse(request.params);

  try {
    const findPostByIdUseCase = makeFindPostByIdUseCase();
    const { post } = await findPostByIdUseCase.execute({
      postId: id,
    });

    return reply.status(200).send({ post });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}

export const findByIdPostSchema = {
  summary: "Retrieve a post by its ID",
  tags: ["Posts"],
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
    404: {
      type: "object",
      properties: {
        message: { type: "string", example: "Resource not found." },
      },
    },
    400: {
      type: "object",
      properties: {
        message: { type: "string" },
        issues: { type: "object" },
      },
    },
  },
};
