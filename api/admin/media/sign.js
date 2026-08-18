import { createHash } from "node:crypto";
import { requireAdmin } from "../../_lib/auth.js";
import { allowMethods, assertSameOrigin, handleApiError, sendJson } from "../../_lib/http.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["POST"])) return;
  if (!await requireAdmin(request, response)) return;
  try {
    assertSameOrigin(request);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      const error = new Error("Cloudinary is not configured.");
      error.statusCode = 503;
      throw error;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "jabir-portfolio";
    const signature = createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    sendJson(response, 200, { cloudName, apiKey, timestamp, folder, signature });
  } catch (error) {
    handleApiError(response, error);
  }
}
