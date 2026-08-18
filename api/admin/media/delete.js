import { createHash } from "node:crypto";
import { requireAdmin } from "../../_lib/auth.js";
import { allowMethods, assertSameOrigin, handleApiError, readJson, sendJson } from "../../_lib/http.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["DELETE"])) return;
  if (!await requireAdmin(request, response)) return;
  try {
    assertSameOrigin(request);
    const { publicId = "" } = await readJson(request);
    if (typeof publicId !== "string" || !publicId.startsWith("jabir-portfolio/resumes/")) {
      sendJson(response, 400, { error: "Only managed r?sum? files can be deleted." });
      return;
    }
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      const error = new Error("Cloudinary is not configured.");
      error.statusCode = 503;
      throw error;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHash("sha1")
      .update(`invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");
    const form = new FormData();
    form.append("public_id", publicId);
    form.append("timestamp", String(timestamp));
    form.append("invalidate", "true");
    form.append("api_key", apiKey);
    form.append("signature", signature);
    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/raw/destroy`, { method: "POST", body: form });
    const payload = await cloudinaryResponse.json().catch(() => ({}));
    if (!cloudinaryResponse.ok || !["ok", "not found"].includes(payload.result)) {
      const error = new Error("Cloudinary could not delete the r?sum?.");
      error.statusCode = 502;
      throw error;
    }
    sendJson(response, 200, { deleted: true });
  } catch (error) {
    handleApiError(response, error);
  }
}
