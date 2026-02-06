import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();
  return (
    <div className="min -w-full flex min-h-screen flex-col items-center justify-center gap-y-6">
      <div>{JSON.stringify(data, null, 2)}</div>
      <LogoutButton />
    </div>
  );
};

export default Page;
