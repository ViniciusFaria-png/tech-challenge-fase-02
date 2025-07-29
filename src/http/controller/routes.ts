import { FastifyInstance } from "fastify";
import { findAll, findAllPostsSchema } from "./post/find-all";
import { search } from "./post/search";
import { findById, findByIdPostSchema } from "./post/find-by-id";
import { create, createPostSchema } from "./post/create";
import { update, updatePostSchema } from "./post/update";
import { deletePostSchema, remove } from "./post/delete";
import { validateJWT } from "../middlewares/jwt-validate";

export async function postRoutes(app: FastifyInstance) {
 
  app.get("/posts/search", search);
  
  app.get("/posts/:id", { schema: findByIdPostSchema }, findById);

  app.get("/posts", { schema: findAllPostsSchema }, findAll);
 
  // JWT validation middleware applied to all post routes except GET /posts
  app.post("/posts", {onRequest:[validateJWT], schema: createPostSchema }, create);

  app.put("/posts/:id", {onRequest:[validateJWT], schema: updatePostSchema }, update);

  app.delete("/posts/:id", {onRequest:[validateJWT], schema: deletePostSchema }, remove);

  
}
