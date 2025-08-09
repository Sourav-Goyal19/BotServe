import cors from "cors";
import dotenv from "dotenv";
import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import fastifyExpress from "@fastify/express";
import userRoutes from "./routes/auth.route";

const PORT = 5000;

dotenv.config();

const fastify = Fastify();

fastify.get("/", async (req, res) => {
  return res.status(200).send({ msg: "hey there" });
});

fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET!,
});

fastify.register(fastifyExpress).after(() => {
  fastify.use(
    cors({
      origin: [process.env.FRONTEND_URL!, "http://localhost:5173"],
      credentials: true,
    })
  );
});

fastify.register(userRoutes, { prefix: "/api/user" });

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log(`Server listening on ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
