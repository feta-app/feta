import { mutation } from "./_generated/server";

// Send a chat message.
export default mutation(({ db }, body: string) => {
  const message = { body };
  db.insert("freefood", message);
});
