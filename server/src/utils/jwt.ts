import jwt from "jsonwebtoken";
import "dotenv/config";

const JWTSECRETKEY = process.env.JWTSECRETKEY;

export const generateToken = (data: any) => {
  return jwt.sign(data, JWTSECRETKEY!);
};

export const getUser = (token: string) => {
  try {
    const verify = jwt.verify(token, JWTSECRETKEY!);
    return { user: verify };
  } catch (error) {
    return { user: null };
  }
};
