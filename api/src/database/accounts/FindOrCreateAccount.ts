import {database} from "@src/database/Database";
import {eq} from "drizzle-orm";
import {users} from "@src/database/schema/Users";
import type {Account} from "@src/database/types/Account";
import type {NewAccount} from "@src/database/types/NewAccount";

/** The account of a Google subject, made if there is none; a subject that is already known keeps the account it has. */
export async function findOrCreateAccount(googleSub: string, newAccount: NewAccount): Promise<Account> {
  await database
    .insert(users)
    .values({id: newAccount.id, googleSub, email: newAccount.email, createdAt: newAccount.now})
    .onConflictDoNothing({target: users.googleSub});

  const [account] = await database
    .select({id: users.id, email: users.email})
    .from(users)
    .where(eq(users.googleSub, googleSub));

  if (!account) {
    throw new Error("The account that was just made is not there.");
  }

  return account;
}
