import { clearSessionCookie, getAdminCredential, hashPassword, requireAdmin, verifyPasswordHash } from "../_lib/auth.js";
import { query } from "../_lib/db.js";
import { allowMethods, assertSameOrigin, handleApiError, readJson, sendJson } from "../_lib/http.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["PUT"])) return;
  if (!await requireAdmin(request, response)) return;
  try {
    assertSameOrigin(request);
    const { currentPassword = "", newPassword = "" } = await readJson(request);
    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      sendJson(response, 400, { error: "Current and new passwords are required." });
      return;
    }
    if (newPassword.length < 4 || newPassword.length > 128) {
      sendJson(response, 400, { error: "New password must contain between 4 and 128 characters." });
      return;
    }

    const credential = await getAdminCredential();
    if (!verifyPasswordHash(currentPassword, credential.passwordHash)) {
      sendJson(response, 401, { error: "Current password is incorrect." });
      return;
    }
    if (verifyPasswordHash(newPassword, credential.passwordHash)) {
      sendJson(response, 400, { error: "New password must be different from the current password." });
      return;
    }

    await query(
      "update portfolio_admin_credentials set password_hash = $1, updated_at = now() where singleton = true",
      [hashPassword(newPassword)],
    );
    response.setHeader("Set-Cookie", clearSessionCookie());
    sendJson(response, 200, { changed: true, authenticated: false });
  } catch (error) {
    handleApiError(response, error);
  }
}
