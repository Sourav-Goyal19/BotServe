import "dotenv/config";
import jwt from "jsonwebtoken";
import { userSchema, UserType } from "../db/schema";

const JWTSECRETKEY = process.env.JWTSECRETKEY;

export const generateToken = (data: UserType) => {
  return jwt.sign(
    {
      id: data.id,
      name: data.name,
      email: data.email,
    },
    JWTSECRETKEY!,
    { expiresIn: "3d" }
  );
};

export const getUser = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWTSECRETKEY!);
    if (typeof decoded == "object" && decoded != null) {
      const parsedUser = userSchema.partial().safeParse(decoded);

      if (parsedUser.success) {
        const { password, apiKey, ...user } = parsedUser.data;
        return { user: user };
      } else {
        return { user: null };
      }
    }
    return { user: null };
  } catch (error) {
    return { user: null };
  }
};
