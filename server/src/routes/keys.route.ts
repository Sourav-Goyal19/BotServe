import { FastifyInstance, FastifyPluginOptions } from "fastify";

import { authMiddleware } from "../middlewares/auth.middleware";
import {
  handleDeleteKey,
  handleGenerateKey,
  handleGetKeys,
  handleUpdateKey,
} from "../controllers/keys.controller";

function keyRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post(
    "/generate",
    { preHandler: [authMiddleware] },
    handleGenerateKey
  );

  fastify.get("/all", { preHandler: [authMiddleware] }, handleGetKeys);

  fastify.delete("/revoke", { preHandler: [authMiddleware] }, handleDeleteKey);

  fastify.patch("/update", { preHandler: [authMiddleware] }, handleUpdateKey);
}

export default keyRoutes;
