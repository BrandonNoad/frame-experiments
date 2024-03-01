import { FrontendApi, Configuration } from "@ory/client";
import { isUiNodeInputAttributes } from "@ory/integrations/ui";

import type { LoginFlow } from "@ory/client";

export const getOryFrontendApiClient = () =>
  new FrontendApi(
    new Configuration({
      basePath: process.env.ORY_SDK_URL,
      baseOptions: {
        withCredentials: true,
      },
    }),
  );

const getUiNodeInputValue = (
  flow: { ui: LoginFlow["ui"] },
  { nodeGroup, attributeName }: { nodeGroup: string; attributeName: string },
) => {
  const node = flow.ui.nodes.find((node) => {
    if (node.group !== nodeGroup || !isUiNodeInputAttributes(node.attributes)) {
      return false;
    }

    const attributes = node.attributes;

    return attributes.name === attributeName;
  });

  if (
    !node ||
    !isUiNodeInputAttributes(node.attributes) ||
    typeof node.attributes.value !== "string"
  ) {
    throw new Error("Bad Implementation: Value not found in flow!");
  }

  return node.attributes.value;
};

export const getOidcDataFromFlow = (flow: LoginFlow) => {
  const csrfToken = getUiNodeInputValue(flow, {
    nodeGroup: "default",
    attributeName: "csrf_token",
  });

  const provider = getUiNodeInputValue(flow, {
    nodeGroup: "oidc",
    attributeName: "provider",
  });

  return { csrfToken, provider };
};
