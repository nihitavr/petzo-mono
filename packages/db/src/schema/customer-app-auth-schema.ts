import { relations } from "drizzle-orm";
import { index, primaryKey } from "drizzle-orm/pg-core";

import {
  accountSchema,
  sessionSchema,
  userSchema,
  verificationTokenSchema,
} from "./_auth";
import { customerPgTable } from "./_table";

export const customerUsers = customerPgTable("user", userSchema);

export const customerUsersRelations = relations(customerUsers, ({ many }) => ({
  accounts: many(customerAccounts),
}));

export const customerAccounts = customerPgTable(
  "account",
  accountSchema,
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("customer_app_accounts_userId_idx").on(account.userId),
  }),
);

export const customerAccountsRelations = relations(
  customerAccounts,
  ({ one }) => ({
    user: one(customerUsers, {
      fields: [customerAccounts.userId],
      references: [customerUsers.id],
    }),
  }),
);

export const customerSessions = customerPgTable(
  "session",
  sessionSchema,
  (session) => ({
    userIdIdx: index("customer_app_sessions_userId_idx").on(session.userId),
  }),
);

export const customerSessionsRelations = relations(
  customerSessions,
  ({ one }) => ({
    user: one(customerUsers, {
      fields: [customerSessions.userId],
      references: [customerUsers.id],
    }),
  }),
);

export const customerVerificationTokens = customerPgTable(
  "verificationToken",
  verificationTokenSchema,
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
