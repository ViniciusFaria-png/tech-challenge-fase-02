import { FastifyInstance } from "fastify";
import { findAll, findAllPostsSchema } from "./find-all";
import { search } from "./search";
import { findById, findByIdPostSchema } from "./find-by-id";
import { create, createPostSchema } from "./create";
import { update, updatePostSchema } from "./update";
import { deletePostSchema, remove } from "./delete";
import { validateJWT } from "../../middlewares/jwt-validate";

export async function postRoutes(app: FastifyInstance) {
 
  app.get("/posts/search", search);
  
  app.get("/posts/:id", { schema: findByIdPostSchema }, findById);

  app.get("/posts", { schema: findAllPostsSchema }, findAll);
 
  // JWT validation middleware applied to all post routes except GET /posts
  app.post("/posts", {onRequest:[validateJWT], schema: createPostSchema }, create);

  app.put("/posts/:id", {onRequest:[validateJWT], schema: updatePostSchema }, update);

  app.delete("/posts/:id", {onRequest:[validateJWT], schema: deletePostSchema }, remove);

  
}
