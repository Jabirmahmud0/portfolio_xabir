import { checkLoginRateLimit, createSessionCookie, resetLoginRateLimit, verifyAdminPassword } from "../_lib/auth.js";
import { allowMethods, assertSameOrigin, handleApiError, readJson, sendJson } from "../_lib/http.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["POST"])) return;
  try {
    assertSameOrigin(request);
    checkLoginRateLimit(request);
    const { password = "" } = await readJson(request);
    if (typeof password !== "string" || password.length > 128) {
      sendJson(response, 401, { error: "Invalid password." });
      return;
    }
    const credentialCheck = await verifyAdminPassword(password);
    if (!credentialCheck.valid) {
      sendJson(response, 401, { error: "Invalid password." });
      return;
    }
    resetLoginRateLimit(request);
    response.setHeader("Set-Cookie", createSessionCookie(credentialCheck.passwordHash));
    sendJson(response, 200, { authenticated: true });
  } catch (error) {
    handleApiError(response, error);
  }
}
