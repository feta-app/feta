import { query } from "./_generated/server";

export default query(async ({ db }, userID) => {
  const foods = await db.table("foodItems").filter(q => q.eq(q.field('userID'),userID)).collect();
  return foods;
});