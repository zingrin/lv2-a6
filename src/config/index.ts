import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  connection_str: process.env.CONNECTION_STR,
};
