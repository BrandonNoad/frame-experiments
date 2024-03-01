import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Axios from "axios";

import { getOryFrontendApiClient, getOidcDataFromFlow } from "~/util/ory";

import type { LoginFlow } from "@ory/client";

export async function GET() {
  const headersList = headers();

  const oryFrontendApiClient = getOryFrontendApiClient();

  let flow: LoginFlow;
  try {
    ({ data: flow } = await oryFrontendApiClient.createBrowserLoginFlow({
      cookie: headersList.get("cookie") ?? undefined,
      returnTo: `${process.env.BASE_URL}/gm`,
    }));
  } catch (err) {
    if (
      Axios.isAxiosError(err) &&
      err.response?.status === 400 &&
      err.response.data.error.id === "session_already_available"
    ) {
      return redirect("/gm");
    }

    throw err;
  }

  const { csrfToken, provider } = getOidcDataFromFlow(flow);

  let location: string = "";
  let cookies: string[] = [];
  try {
    await oryFrontendApiClient.updateLoginFlow({
      flow: flow.id,
      updateLoginFlowBody: {
        csrf_token: csrfToken,
        method: "oidc",
        provider,
      },
    });

    throw new Error("Bad Implementation! Expected 422 response.");
  } catch (err) {
    if (!Axios.isAxiosError(err) || err.response?.status !== 422) {
      throw err;
    }

    location = err.response.data.redirect_browser_to;
    cookies = err.response.headers["set-cookie"] ?? [];
  }

  const responseHeaders = new Headers({ Location: location });
  cookies.forEach((value) => {
    responseHeaders.append("Set-Cookie", value);
  });

  return new Response(null, { headers: responseHeaders, status: 303 });
}
