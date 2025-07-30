import { makeCreatePostUseCase } from "@/use-cases/factory/make-create-post-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const createPostBodySchema = z.object({
  titulo: z.string().min(1, "Title is required."),
  resumo: z.string().optional(),
  conteudo: z.string().min(1, "Content is required."),
  professor_id: z.string().uuid("Invalid professor ID format.")
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { titulo, resumo, conteudo, professor_id } = createPostBodySchema.parse(
      request.body
    );

    const createPostUseCase = makeCreatePostUseCase();
    const { post } = await createPostUseCase.execute({
      titulo,
      resumo,
      conteudo,
      professor_id,
    });

    return reply.status(201).send({ post });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Validation error.",
        issues: err.issues,
      });
    }
    console.error("Create post error:", err);
    throw err;
  }
}

export const createPostSchema = {
  summary: "Create a new post",
  tags: ["Posts"],
  body: {
    type: "object",
    properties: {
      titulo: { type: "string", minLength: 1 },
      resumo: { type: "string" },
      conteudo: { type: "string", minLength: 1 },
      professor_id: { type: "string", format: "uuid" },
    },
    required: ["titulo", "conteudo", "professor_id"],
  },
  response: {
    201: {
      type: "object",
      properties: {
        post: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Generated UUID for the post",
            },
            titulo: { type: "string" },
            resumo: { type: "string", nullable: true },
            conteudo: { type: "string" },
            professor_id: { type: "string", format: "uuid" },
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
        message: { type: "string", example: "Validation error." },
        issues: {
          type: "object",
          description: "Details about validation errors",
        },
      },
    },
    401: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "User not authenticated or invalid professor ID",
        },
      },
    },
  },
};
