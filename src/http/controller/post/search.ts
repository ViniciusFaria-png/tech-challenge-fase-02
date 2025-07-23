import { PostRepository } from "@/repositories/pg/post.repository";
import { SearchQueryStringUseCase } from "@/use-cases/search-post";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const registerQuerySchema = z.object({
    query: z.string().min(1, "Query parameter is required"),
  });

  try {
    const { query } = registerQuerySchema.parse(request.query);
    const postRepository = new PostRepository();
    const createSearchUseCase = new SearchQueryStringUseCase(postRepository);
    const post = await createSearchUseCase.handler(query);
    if (!post || (Array.isArray(post) && post.length === 0)) {
      return reply.status(404).send();
    }
    return reply.status(200).send(post);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: "Invalid query parameter",
        details: err.issues,
      });
    }
    console.error("Search error:", err);
    return reply.status(500).send();
  }
}
