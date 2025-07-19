import fastify from "fastify";
import { postRoutes } from "./http/controller/post/routes";

export const app = fastify();

app.register(postRoutes)
