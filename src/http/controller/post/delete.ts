import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { makeDeletePostUseCase } from "@/use-cases/factory/make-delete-post-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const deletePostParamsSchema = z.object({
  id: z.string().uuid("Invalid post ID format."),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deletePostParamsSchema.parse(request.params);

  try {
    const deletePostUseCase = makeDeletePostUseCase();
    await deletePostUseCase.execute({
      postId: id,
    });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}

export const deletePostSchema = {
  summary: "Delete a post by its ID",
  tags: ["Posts"],
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
      description: "Successfully deleted the post.",
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
