import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Axios from "axios";

import { getOryFrontendApiClient } from "~/util/ory";

export default async function Logout() {
  const headersList = headers();

  const oryFrontendApiClient = getOryFrontendApiClient();

  try {
    // If the user is not logged in, then this request should fail with a 401 status.
    const { data } = await oryFrontendApiClient.createBrowserLogoutFlow({
      cookie: headersList.get("cookie") ?? undefined,
      returnTo: `${process.env.BASE_URL}/`,
    });

    // Ory will handle "deleting" the session cookie when it responds to this redirect.
    // `data.logout_url` uses the domain from the Ory client config, but we must go through our
    // custom domain to ensure cookies are handled correctly.
    return redirect(
      `${process.env.BASE_URL}/api/.ory/self-service/logout${new URL(data.logout_url).search}`,
    );
  } catch (err) {
    if (!Axios.isAxiosError(err) || err.response?.status !== 401) {
      throw err;
    }

    // no-op; Fall through to redirect below.
  }

  return redirect("/");
}
