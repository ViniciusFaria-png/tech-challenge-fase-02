import { PostRepository } from "@/repositories/post.repository";
import { SearchQueryStringUseCase } from "@/use-cases/search-post";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply ){
    const registerQuerySchema = z.object({
        query: z.string(),
    })

    // For GET, use request.query
    const { query } = registerQuerySchema.parse(request.query)

    try {
        const postRepository = new PostRepository()
        const createSearchUseCase = new SearchQueryStringUseCase(postRepository)
        const post = await createSearchUseCase.handler(query)
        if (!post) {
            return reply.status(404).send()
        }
        return reply.status(200).send(post)
    } catch (err) {
        console.log("Not found.")
        return reply.status(500).send()
    }
}