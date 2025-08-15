import {
  FastifyReply,
  FastifyRequest,
  FastifyInstance,
  FastifyPluginOptions,
} from "fastify";
import { z } from "zod";
import { validate } from "uuid";
import { db } from "../db/drizzle";
import { and, eq } from "drizzle-orm";
import { projectsTable } from "../db/schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const projectValidationSchema = z.object({
  name: z.string().min(1, "Project Name is required"),
});

type ProjectParamsType = {
  projectId: string;
};

function projectRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify
    .get(
      "/all",
      { preHandler: [authMiddleware] },
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const user = request.user!;

          const projects = await db
            .select()
            .from(projectsTable)
            .where(eq(projectsTable.userId, user.id!));

          return reply.status(200).send({
            message: "Projects found successfully",
            success: true,
            projects,
          });
        } catch (error) {
          console.error("PROJECT[GET-ALL]:", error);
          return reply.status(500).send({
            error: "Something went wrong",
            success: false,
          });
        }
      }
    )
    .get<{ Params: ProjectParamsType }>(
      "/:projectId",
      { preHandler: [authMiddleware] },
      async (request, reply) => {
        try {
          const projectId = request.params.projectId;
          const user = request.user!;

          if (!validate(projectId)) {
            return reply.status(400).send({
              error: "Invalide project id",
              success: false,
            });
          }

          const [project] = await db
            .select()
            .from(projectsTable)
            .where(
              and(
                eq(projectsTable.id, projectId),
                eq(projectsTable.userId, user.id!)
              )
            );

          if (!project) {
            return reply.status(404).send({
              error: "Project with the given id not found",
              success: false,
            });
          }

          return { message: "Project found", success: true, project };
        } catch (error) {
          console.error("PROJECT[GET]:", error);
          return reply.status(500).send({
            error: "Something went wrong",
            success: false,
          });
        }
      }
    )
    .post(
      "/create",
      { preHandler: [authMiddleware] },
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          const body = request.body;
          const user = request.user;

          const { error, data } = projectValidationSchema.safeParse(body);

          if (error) {
            return reply.status(400).send({
              error: error.message,
              success: false,
            });
          }

          const { name } = data;

          const [project] = await db
            .insert(projectsTable)
            .values({
              name,
              userId: user?.id!,
            })
            .returning();

          return {
            message: "Project Created successfully",
            success: true,
            project,
          };
        } catch (error) {
          console.error("PROJECT[CREATE]:", error);
          return reply.status(500).send({
            error: "Something went wrong",
            success: false,
          });
        }
      }
    )
    .patch<{ Params: ProjectParamsType }>(
      "/:projectId",
      { preHandler: [authMiddleware] },
      async (request, reply) => {
        try {
          const projectId = request.params.projectId;
          const user = request.user!;
          const body = request.body;

          const { error, data } = projectValidationSchema.safeParse(body);

          if (error) {
            return reply.status(400).send({
              error: error.message,
              success: false,
            });
          }

          if (!validate(projectId)) {
            return reply.status(400).send({
              error: "Invalid project Id",
              success: false,
            });
          }

          const { name } = data;

          const [project] = await db
            .update(projectsTable)
            .set({
              name,
            })
            .where(
              and(
                eq(projectsTable.id, projectId),
                eq(projectsTable.userId, user.id!)
              )
            )
            .returning();

          if (!project) {
            return reply.status(404).send({
              error: "Project with the given id not found",
              success: false,
            });
          }

          return {
            message: "Project updated successfully",
            success: true,
            project,
          };
        } catch (error) {
          console.error("PROJECT[PATCH]:", error);
          return reply.status(500).send({
            error: "Something went wrong",
            success: false,
          });
        }
      }
    )
    .delete<{ Params: ProjectParamsType }>(
      "/:projectId",
      { preHandler: [authMiddleware] },
      async (request, reply) => {
        try {
          const projectId = request.params.projectId;
          const user = request.user!;

          if (!validate(projectId)) {
            return reply.status(400).send({
              error: "Invalide project id",
              success: false,
            });
          }

          const [project] = await db
            .delete(projectsTable)
            .where(
              and(
                eq(projectsTable.id, projectId),
                eq(projectsTable.userId, user.id!)
              )
            )
            .returning();

          if (!project) {
            return reply.status(404).send({
              error: "Project with the given id not found",
              success: false,
            });
          }

          return {
            message: "Project Deleted successfully",
            success: true,
          };
        } catch (error) {
          console.error("PROJECT[DELETE]:", error);
          return reply.status(500).send({
            error: "Something went wrong",
            success: false,
          });
        }
      }
    );
}

export default projectRoutes;
