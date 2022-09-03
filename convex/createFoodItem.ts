import { mutation } from "./_generated/server";

// Create a food item
export default mutation(async ({ db, auth }, description: string, lat: number, long: number, expiresIn: number, photo: string) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to createFoodItem");
    
    const user = await db.table("users").filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)).unique();
    
    const now = Math.floor(Date.now() / 1000);
    const item = {
        description,
        lat,
        long,
        expiresIn,
        photo,
        createdAt: now,
        expiresAt: now + expiresIn,
        userID: user._id,
    };
    db.insert("foodItems", item);
});
