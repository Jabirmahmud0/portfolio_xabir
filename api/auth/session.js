import { isAdminRequest } from "../_lib/auth.js";
import { allowMethods, handleApiError, sendJson } from "../_lib/http.js";

export default async function handler(request, response) {
  if (!allowMethods(request, response, ["GET"])) return;
  try {
    sendJson(response, 200, { authenticated: await isAdminRequest(request) });
  } catch (error) {
    handleApiError(response, error);
  }
}
