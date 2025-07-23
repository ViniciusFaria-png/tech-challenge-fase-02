import { FastifyInstance } from "fastify";
import { search } from "./search";

export async function postRoutes(app:FastifyInstance) {
    app.get('/search',search)
    console.log('Rota /search registrada')
    
}