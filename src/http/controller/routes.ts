import { FastifyInstance } from "fastify";
import { findAll, findAllPostsSchema } from "./post/find-all";
import { search } from "./post/search";
import { findById, findByIdPostSchema } from "./post/find-by-id";
import { create, createPostSchema } from "./post/create";
import { update, updatePostSchema } from "./post/update";
import { deletePostSchema, remove } from "./post/delete";
import { createUser, createUserSchema } from "./user/create";
import { findByIdUser, findByIdUserSchema } from "./user/find-by-id";
import { deleteUserSchema, removeUser } from "./user/delete";

export async function postRoutes(app: FastifyInstance) {
  app.get("/posts/search", search);
  app.post("/posts", { schema: createPostSchema }, create);

  app.get("/posts/:id", { schema: findByIdPostSchema }, findById);

  app.get("/posts", { schema: findAllPostsSchema }, findAll);

  app.put("/posts/:id", { schema: updatePostSchema }, update);

  app.delete("/posts/:id", { schema: deletePostSchema }, remove);

  app.delete("/users/:id", { schema: deleteUserSchema }, removeUser);

  app.post("/users", { schema: createUserSchema }, createUser);

  app.get("/users/:id", { schema: findByIdUserSchema }, findByIdUser);
  
}
