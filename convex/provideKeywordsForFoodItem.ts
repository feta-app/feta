import { mutation } from "./_generated/server";
// @ts-ignore
import sha256 from "sha256";

export default mutation(async ({ db }, foodItemID: string, keywords: {
    name: string,
    value: number,
}[], token: string) => {
    // Hash the given token.
    const tokenHash = sha256(token);

    // Check that it's equal to our hash.
    const actualHash = "19317b0597d2f87c4f6968e3f2893dd7edc9e32ee8ccaddc4956b6bc83bb80df";
    if (tokenHash !== actualHash) {
        throw new Error("Invalid token");
    }

    // Check that the food item exists.
    const foodItem = await db.table("foodItems").filter(q => q.eq(foodItemID, q.field("_id"))).unique();
    if (!foodItem) {
        throw new Error("Food item not found");
    }

    // Patch the keywords.
    db.patch(foodItem._id, {
        keywords,
    });
});