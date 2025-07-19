import { PostRepository } from "@/repositories/post.repository";
import { SearchQueryStringUseCase } from "@/use-cases/search-post";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply ){
    const registerBodySchema = z.object({
        query: z.string(),
    })

    const { query } = registerBodySchema.parse(request.body)

    try
    {
        const postRepository = new PostRepository()

        const createSearchUseCase = new SearchQueryStringUseCase(postRepository)
        
        const post = await createSearchUseCase.handler(query)
        return reply.status(201).send(post)
    }
    catch(err)
    {
        console.log("Not found.")
        return reply.status(404).send()
    }
}