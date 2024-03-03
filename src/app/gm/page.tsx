import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FrontendApi, Configuration } from "@ory/client";
import Link from "next/link";
import { ethers } from "ethers";

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

  const address = session.identity?.traits.username as string;

  let ensName: string | null = null;
  try {
    const provider = new ethers.JsonRpcProvider(
      "https://www.noderpc.xyz/rpc-mainnet/public",
    );

    ensName = await provider.lookupAddress(address);
  } catch (err) {
    // no-op
  }

  return (
    <div>
      <div className="relative">
        <Button asChild className="absolute right-4 top-4">
          <Link href="/logout">Sign Out</Link>
        </Button>
      </div>
      <main className="flex min-h-screen flex-col items-center justify-center text-center">
        <p className="text-base font-semibold sm:text-2xl">
          🎩 GM{" "}
          <span className="text-sm sm:text-2xl">{ensName ?? address}</span>
        </p>
      </main>
    </div>
  );
}
