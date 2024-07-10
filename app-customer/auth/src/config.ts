import type { DefaultSession, NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";

import { customerPgTable, db } from "@petzo/db";
import { slackUtils } from "@petzo/utils";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  basePath: "/api/auth",
  adapter: DrizzleAdapter(db, customerPgTable),
  providers: [Google],
  callbacks: {
    signIn: async (opts) => {
      await slackUtils.sendSlackMessage({
        channel: "#signin-alerts",
        username: "auth-bot",
        iconEmoji: ":tada:",
        message: `New User Signin, Name: \`${opts?.user?.name}\`, Email: ${opts?.user?.email}`,
      });

      return true;
    },
    session: (opts) => {
      if (!("user" in opts)) throw "unreachable with session strategy";
      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;
