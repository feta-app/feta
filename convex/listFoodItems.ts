import { query } from "./_generated/server";

export default query(async ({ db }) => {
  const now = Math.floor(Date.now() / 1000);
  const foods = await db.table("foodItems").filter(q => q.lte(now, q.field("expiresAt"))).collect();
  return await Promise.all(foods.map(async food => {
    const user = await db.table("users").filter(q => q.eq(q.field('_id'), food.userID)).unique();
    const ratings = await db.table("ratings").filter(q => q.eq(q.field('foodItemID'), food._id)).collect();
    const ratingsBag = [0, 0, 0];
    ratings.forEach(({ rating }) => {
      if (rating === 0) ratingsBag[0]++;
      if (rating === 1) ratingsBag[1]++;
      if (rating === 2) ratingsBag[2]++;
    });

    return {
      ...food,
      ratings: ratingsBag,
      userName: user.name,
    };
  }));
});