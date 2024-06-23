import dotenv from "dotenv";
dotenv.config();

export default {
  THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_DOMAIN: process.env.CLIENT_DOMAIN || "localhost:5173",
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY || "",
};
