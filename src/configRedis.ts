import { createClient } from "redis";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const getRedisClient = () => {
  const client = createClient({
    url: REDIS_URL,
  });

  client.on("connect", () => {
    console.log("Redis Connected !!!");
  });

  client.on("error", (err) => {
    console.log("Error " + err);
  });

  return client;
};

export default getRedisClient;
