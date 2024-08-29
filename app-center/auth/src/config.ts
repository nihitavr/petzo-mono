import type { DefaultSession, NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";

import { centerPgTable, db } from "@petzo/db";
import { adminUtils } from "@petzo/utils";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  basePath: "/api/auth",
  adapter: DrizzleAdapter(db, centerPgTable),
  providers: [Google],
  callbacks: {
    session: (opts) => {
      if (!("user" in opts)) throw "unreachable with session strategy";
      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
          role: adminUtils.isAdmin(opts.session.user.id, env.ADMIN_USER_IDS)
            ? "admin"
            : "user",
        },
      };
    },
  },
} satisfies NextAuthConfig;
