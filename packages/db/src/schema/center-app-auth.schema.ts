import { relations } from "drizzle-orm";
import { index, primaryKey } from "drizzle-orm/pg-core";

import {
  accountSchema,
  sessionSchema,
  userSchema,
  verificationTokenSchema,
} from "./_auth";
import { centerPgTable } from "./_table";

export const centerUsers = centerPgTable("user", userSchema);

export const centerUsersRelations = relations(centerUsers, ({ many }) => ({
  accounts: many(centerAccounts),
}));

export const centerAccounts = centerPgTable(
  "account",
  accountSchema,
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("center_app_accounts_userId_idx").on(account.userId),
  }),
);

export const centerAccountsRelations = relations(centerAccounts, ({ one }) => ({
  user: one(centerUsers, {
    fields: [centerAccounts.userId],
    references: [centerUsers.id],
  }),
}));

export const centerSessions = centerPgTable(
  "session",
  sessionSchema,
  (session) => ({
    userIdIdx: index("center_app_sessions_userId_idx").on(session.userId),
  }),
);

export const centerSessionsRelations = relations(centerSessions, ({ one }) => ({
  user: one(centerUsers, {
    fields: [centerSessions.userId],
    references: [centerUsers.id],
  }),
}));

export const centerVerificationTokens = centerPgTable(
  "verificationToken",
  verificationTokenSchema,
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
