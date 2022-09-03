import { query } from "./_generated/server";

export default query(async ({ db }, filter="") => {
  const foods = await db.table("foodItems").collect();
  return foods.filter(f => f.body.includes(filter));
});