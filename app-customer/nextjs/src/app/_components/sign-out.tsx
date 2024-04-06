"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

import { Button } from "@petzo/ui/components/button";
import Loader from "@petzo/ui/components/loader";

export default function SignOut() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    await signOut({ callbackUrl: "/" });
    setIsSigningIn(false);
  };

  return (
    <Button
      className="flex items-center justify-center gap-2"
      disabled={isSigningIn}
      variant="primary"
      onClick={handleSignIn}
    >
      <span>Sign Out</span>
      <div>
        <Loader className="h-5 w-5 border-2" show={isSigningIn} />
      </div>
    </Button>
  );
}
