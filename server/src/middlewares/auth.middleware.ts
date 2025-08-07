import { FastifyReply, FastifyRequest } from "fastify";

export const authMiddleware = (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const cookie = request.cookies.token;

  if (!cookie) {
    return reply.status(401).send("Unauthorized. No cookie.");
  }
};
