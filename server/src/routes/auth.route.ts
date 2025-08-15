import {
  handleGetUser,
  handleLogin,
  handleSignup,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export function userRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post("/signup", handleSignup);

  fastify.post("/login", handleLogin);

  fastify.get("/one", { preHandler: [authMiddleware] }, handleGetUser);
}

export default userRoutes;
