async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Request failed.");
  return payload;
}

export const adminApi = {
  session: () => request("/api/auth/session"),
  login: (credentials) => request("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  changePassword: (passwords) => request("/api/admin/password", { method: "PUT", body: JSON.stringify(passwords) }),
  projects: () => request("/api/admin/projects"),
  createProject: (project) => request("/api/admin/projects", { method: "POST", body: JSON.stringify(project) }),
  updateProject: (project) => request(`/api/admin/projects/${project.id}`, { method: "PUT", body: JSON.stringify(project) }),
  deleteProject: (id) => request(`/api/admin/projects/${id}`, { method: "DELETE" }),
  sections: () => request("/api/admin/sections"),
  updateSection: (section) => request("/api/admin/sections", { method: "PUT", body: JSON.stringify(section) }),
  uploadMedia: async (file, resourceType = "image") => {
    const signed = await request("/api/admin/media/sign", { method: "POST", body: JSON.stringify({ resourceType }) });
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", signed.apiKey);
    form.append("timestamp", String(signed.timestamp));
    form.append("folder", signed.folder);
    form.append("signature", signed.signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/${signed.resourceType}/upload`, { method: "POST", body: form });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.secure_url) throw new Error(payload.error?.message || "Image upload failed.");
    return { url: payload.secure_url, publicId: payload.public_id, resourceType: payload.resource_type };
  },
  uploadImage: async (file) => (await adminApi.uploadMedia(file, "image")).url,
  uploadResume: (file) => adminApi.uploadMedia(file, "raw"),
  deleteResume: (publicId) => request("/api/admin/media/delete", { method: "DELETE", body: JSON.stringify({ publicId }) }),
};
