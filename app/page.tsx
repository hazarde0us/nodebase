import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const Page = async () => {
  const users = await prisma.user.findMany();

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center">
      <div>{JSON.stringify(users)}</div>
      <Button variant={"outline"}>Click me</Button>
    </div>
  );
};

export default Page;
