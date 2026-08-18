export function sendJson(response, status, payload, headers = {}) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  for (const [key, value] of Object.entries(headers)) response.setHeader(key, value);
  response.end(JSON.stringify(payload));
}

export async function readJson(request) {
  if (request.body && typeof request.body === "object") return request.body;
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

export function allowMethods(request, response, methods) {
  if (methods.includes(request.method)) return true;
  response.setHeader("Allow", methods.join(", "));
  sendJson(response, 405, { error: "Method not allowed." });
  return false;
}

export function assertSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return;
  const forwardedHost = request.headers["x-forwarded-host"];
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || request.headers.host;
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    originHost = "";
  }
  if (!host || originHost !== host) {
    const error = new Error("Cross-origin request rejected.");
    error.statusCode = 403;
    throw error;
  }
}

export function handleApiError(response, error) {
  const status = error.statusCode || (error.code === "23505" ? 409 : 500);
  const message = status >= 500 ? "The server could not complete the request." : error.message;
  if (status >= 500) console.error(error);
  sendJson(response, status, { error: message });
}
