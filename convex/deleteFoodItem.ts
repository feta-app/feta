import { mutation } from "./_generated/server";

// Delete a food item
export default mutation(async ({ db, auth }, item: string) => {
    // getUserDetails logic
    const counterDoc = await db
        .table('foodItems')
        .filter((q) => q.eq(q.field('_id'), item))
        .first()
    console.log('Got a counter value...')
    if (counterDoc === null) {
        return 0;
    }
    // return counterDoc.counter

    // createFoodItem logic
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated call to deleteFoodItem, no identity.");
    const user = await db.table("users").filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)).unique();
    if (!(user._id.equals(counterDoc.userID))) throw new Error("Unauthenticated call to deleteFoodItem");
    
    // const user = await db.table("users").filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)).unique();
    
    /* const now = Math.floor(Date.now() / 1000);
    const item = {
        description,
        lat,
        long,
        expiresIn,
        photo,
        createdAt: now,
        expiresAt: now + expiresIn,
        userID: user._id,
    }; */
    db.delete(counterDoc._id);
});