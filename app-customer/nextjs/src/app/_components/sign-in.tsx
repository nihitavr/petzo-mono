"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@petzo/ui/components/button";
import Loader from "@petzo/ui/components/loader";
import { cn } from "@petzo/ui/lib/utils";

export default function SignIn({
  callbackUrl,
  onClick,
  className,
  ...props
}: {
  callbackUrl?: string;
  onClick?: () => void;
  className?: string;
}) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    onClick?.();
    

    setIsSigningIn(true);
    await signIn("google", {
      callbackUrl: callbackUrl,
    });
    setIsSigningIn(false);
  };

  return (
    <Button
      className={cn("flex items-center justify-center gap-2 px-4", className)}
      variant="primary"
      disabled={isSigningIn}
      onClick={handleSignIn}
      {...props}
    >
      <span>Sign In</span>
      <div className={`${isSigningIn ? "" : "hidden"}`}>
        <Loader className="h-5 w-5 border-2" show={isSigningIn} />
      </div>
    </Button>
  );
}
