import { auth, signIn } from "@petzo/auth-customer-app";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

export async function AuthCheck({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    return <Unauthorised />;
  }

  if (!session) {
    return (
      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signIn("google");
          }}
        >
          Sign in with Google
        </Button>
      </form>
    );
  }

  return <div>{children}</div>;
}
