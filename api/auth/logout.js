import { clearSessionCookie } from "../_lib/auth.js";
import { allowMethods, assertSameOrigin, handleApiError, sendJson } from "../_lib/http.js";

export default function handler(request, response) {
  if (!allowMethods(request, response, ["POST"])) return;
  try {
    assertSameOrigin(request);
    response.setHeader("Set-Cookie", clearSessionCookie());
    sendJson(response, 200, { authenticated: false });
  } catch (error) {
    handleApiError(response, error);
  }
}
