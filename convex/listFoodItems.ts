import { query } from "./_generated/server";

export default query(async ({ db }) => {
  const now = Math.floor(Date.now() / 1000);
  const foods = await db.table("foodItems").filter(q => q.lte(now, q.field("expiresAt"))).collect();
  return foods;
});