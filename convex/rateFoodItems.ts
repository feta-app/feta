import { mutation } from "./_generated/server";

// Rate a food item.
export default mutation(async ({ db, auth }, foodItemID: string, rating: 0 | 1 | 2) => {
    // Check that the user is logged in and exists.
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to rateFoodItems");
    const user = await db.table("users").filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)).unique();

    // Check that the food item exists.
    const foodItem = await db.table("foodItems").filter(q => q.eq(foodItemID, q.field("_id"))).unique();
    if (!foodItem) {
        throw new Error("Food item not found");
    }

    // Check that the user's not trying to rate their own food.
    if (foodItem.userID === user._id) {
        throw new Error("You can't rate your own food");
    }

    // Check that there isn't already a rating for this user and food item.
    const existingRating = await db.table("ratings").filter(q => q.and(
        q.eq(q.field("userID"), user._id),
        q.eq(q.field("foodItemID"), foodItemID),
    )).first();

    const now = Math.floor(Date.now() / 1000);

    if (existingRating) {
        db.patch(existingRating._id, {
            rating,
        });
        return existingRating._id;
    } else {
        // Create the rating.
        const ratingDoc = {
            userID: user._id,
            foodItemID,
            rating,
            createdAt: now,
        };

        return db.insert("ratings", ratingDoc);
    }    
});
