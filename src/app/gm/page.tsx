import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FrontendApi, Configuration } from "@ory/client";
import Link from "next/link";

import { Button } from "~/components/Button";

import type { Session } from "@ory/client";

const OryFrontendApiClient = new FrontendApi(
  new Configuration({
    basePath: process.env.ORY_SDK_URL,
    baseOptions: {
      withCredentials: true,
    },
  }),
);

export default async function Gm() {
  const headersList = headers();

  let session: Session;
  try {
    ({ data: session } = await OryFrontendApiClient.toSession({
      cookie: headersList.get("cookie") ?? undefined,
    }));
  } catch (err) {
    return redirect("/");
  }

  return (
    <div>
      <div className="relative">
        <Button asChild className="absolute right-4 top-4">
          <Link href="/logout">Sign Out</Link>
        </Button>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-2xl font-semibold">
          🎩 GM {session.identity?.traits.username}
        </p>
      </main>
    </div>
  );
}
