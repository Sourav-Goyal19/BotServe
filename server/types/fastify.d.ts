import { UserType } from "../src/db/schema";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      name?: string;
      email?: string;
      id?: string;
    };
  }
}
