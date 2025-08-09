import { getUser } from "../utils/jwt";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export const authMiddleware = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  const token = request.cookies.token;

  if (!token) {
    reply.status(401).send({ error: "Unauthorized. No cookie." });
    return;
  }

  const { user } = getUser(token);

  if (user == null) {
    reply.status(401).send({ error: "Cookie Expired." });
    return;
  }

  request.user = user;
  done();
};
