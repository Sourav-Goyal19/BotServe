import { z } from "zod";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { usersTable } from "../db/schema";
import { generateToken } from "../utils/jwt";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

const signupSchema = z.object({
  name: z.string().min(1, "Name is Required"),
  email: z.email("Invalid Email").min(1, "Email is Required"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
});

const loginSchema = z.object({
  email: z.email("Invalid Email").min(1, "Email is Required"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
});

export function userRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post("/signup", async (req, reply) => {
    const body = req.body;
    const { error, data } = signupSchema.safeParse(body);

    if (error) {
      return reply.status(401).send({
        error,
        success: false,
      });
    }

    try {
      const { name, email, password } = data;

      const salt = await bcrypt.genSalt(6);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [user] = await db
        .insert(usersTable)
        .values({
          name,
          email,
          password: hashedPassword,
        })
        .returning();

      return reply.status(200).send({
        message: "User signed up successfully",
        success: true,
        user,
      });
    } catch (error) {
      console.error("SIGNUP[POST]:", error);
      return reply
        .status(500)
        .send({ error: "Something went wrong", success: false });
    }
  });

  fastify.post("/login", async (req, reply) => {
    const body = req.body;
    const { error, data } = loginSchema.safeParse(body);

    if (error) {
      return reply.status(401).send({
        error,
        success: false,
      });
    }

    try {
      const { email, password } = data;

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (!user) {
        return reply.status(404).send({
          error: "User not found with the given email",
          success: false,
        });
      }
      const matchingresults = await bcrypt.compare(password, user.password);

      if (!matchingresults) {
        return reply.status(401).send({
          error: "Incorrect password",
          success: false,
        });
      }

      const token = generateToken(user);

      reply.setCookie("token", token, {
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return reply.status(200).send({
        message: "Login Successful",
        success: true,
        user,
      });
    } catch (error) {
      console.error("LOGIN[POST]:", error);
      return reply
        .status(500)
        .send({ error: "Something went wrong", success: false });
    }
  });

  fastify.get("/one", { preHandler: [authMiddleware] }, async (req, reply) => {
    try {
      if (!req.user) {
        reply.status(401).send({
          error: "Session expired",
          success: false,
        });
        return;
      }

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, req.user.id || ""));

      reply.status(200).send({ user, success: true, message: "User found." });
      return;
    } catch (error) {
      console.error("USER[GET]:", error);
      reply.status(500).send({
        error: "Something went wrong",
        success: false,
      });
    }
  });

  fastify.get("/test", (req, reply) => {
    return { msg: "Hey there dude" };
  });
}

export default userRoutes;
