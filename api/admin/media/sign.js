import { createHash } from "node:crypto";
import { requireAdmin } from "../../_lib/auth.js";
import { allowMethods, assertSameOrigin, handleApiError, readJson, sendJson } from "../../_lib/http.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["POST"])) return;
  if (!await requireAdmin(request, response)) return;
  try {
    assertSameOrigin(request);
    const { resourceType = "image" } = await readJson(request);
    if (!["image", "raw"].includes(resourceType)) {
      sendJson(response, 400, { error: "Unsupported media type." });
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
    const folder = resourceType === "raw" ? "jabir-portfolio/resumes" : "jabir-portfolio";
    const signature = createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    sendJson(response, 200, { cloudName, apiKey, timestamp, folder, signature, resourceType });
  } catch (error) {
    handleApiError(response, error);
  }
}
