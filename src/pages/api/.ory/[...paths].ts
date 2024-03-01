// @ory/integrations works in a similar way as ory tunnel, read more about it what it does:
// https://www.ory.sh/docs/guides/cli/proxy-and-tunnel
import { config, createApiHandler } from "@ory/integrations/next-edge";

export { config };

export default createApiHandler({
  fallbackToPlayground: true,
});
