import { FastifyReply, FastifyRequest } from "fastify";

export async function validateJWT(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const route = request.routeOptions?.url || "";
    const method = request.method.toLowerCase();
    console.log("Validating JWT for route:", route, "Method:", method);

    if (route === "/posts" && method === "post" ) return

    await request.jwtVerify();

  } catch (error) {
    return reply.status(401).send({ message: "Invalid token", error: error });
  }
}