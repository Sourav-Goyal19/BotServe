import { z } from "zod";
import { nanoid } from "nanoid";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { db } from "../db/drizzle";
import { apikeysTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { authMiddleware } from "../middlewares/auth.middleware";

const generateKeySchema = z.object({
  name: z.string().min(1, "Name of the API key is required."),
  expiresInDays: z.number().int().positive().optional(),
});

const deleteKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

const updateKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  isActive: z.boolean().optional(),
  name: z.string().min(1).optional(),
});

function generateApiKey() {
  return `bs-${nanoid(48)}`;
}

function keyRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post(
    "/generate",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const body = request.body;
      const { error, data } = generateKeySchema.safeParse(body);

      if (error) {
        return reply.status(400).send({
          error: error.message,
          success: false,
        });
      }

      try {
        const { name, expiresInDays } = data;
        const generatedApiKey = generateApiKey();

        const expiresAt = expiresInDays
          ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
          : null;

        await db.insert(apikeysTable).values({
          name,
          key: generatedApiKey,
          userId: request.user?.id!,
          expiresAt,
          isActive: true,
          usageCount: 0,
        });

        return {
          message: "API key generated successfully.",
          success: true,
          apiKey: generatedApiKey,
          expiresAt,
        };
      } catch (error) {
        console.error("APIKEY[POST]:", error);
        return reply
          .status(500)
          .send({ error: "Something went wrong", success: false });
      }
    }
  );

  fastify.get(
    "/all",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const allApiKeys = await db
          .select({
            id: apikeysTable.id,
            name: apikeysTable.name,
            key: apikeysTable.key,
            lastUsed: apikeysTable.lastUsed,
            expiresAt: apikeysTable.expiresAt,
            isActive: apikeysTable.isActive,
            usageCount: apikeysTable.usageCount,
            createdAt: apikeysTable.createdAt,
          })
          .from(apikeysTable)
          .where(eq(apikeysTable.userId, request.user?.id!));

        return {
          message: "Found all API keys",
          success: true,
          apiKeys: allApiKeys,
        };
      } catch (error) {
        console.error("APIKEY[GET]:", error);
        return reply
          .status(500)
          .send({ error: "Something went wrong", success: false });
      }
    }
  );

  fastify.delete(
    "/revoke",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const body = request.body;
      const { error, data } = deleteKeySchema.safeParse(body);
      if (error) {
        return reply.status(400).send({
          error: error.message,
          success: false,
        });
      }

      try {
        const { apiKey } = data;

        await db
          .delete(apikeysTable)
          .where(
            and(
              eq(apikeysTable.key, apiKey),
              eq(apikeysTable.userId, request.user?.id!)
            )
          );

        return { message: "API key revoked successfully.", success: true };
      } catch (error) {
        console.error("APIKEY[DELETE]:", error);
        return reply
          .status(500)
          .send({ error: "Something went wrong", success: false });
      }
    }
  );

  fastify.patch(
    "/update",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const body = request.body;
      const { error, data } = updateKeySchema.safeParse(body);
      if (error) {
        return reply.status(400).send({
          error: error.message,
          success: false,
        });
      }

      try {
        const { apiKey, ...updateData } = data;

        await db
          .update(apikeysTable)
          .set({
            ...updateData,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(apikeysTable.key, apiKey),
              eq(apikeysTable.userId, request.user?.id!)
            )
          );

        return { message: "API key updated successfully.", success: true };
      } catch (error) {
        console.error("APIKEY[PATCH]:", error);
        return reply
          .status(500)
          .send({ error: "Something went wrong", success: false });
      }
    }
  );
}

export default keyRoutes;
