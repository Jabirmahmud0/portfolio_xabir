import { useState } from "react";
import { adminApi } from "./adminApi.js";

const inputClass = "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-[#00786B] focus:ring-2 focus:ring-[#00786B]/15";

export default function ImageField({ label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be 10 MB or smaller.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      onChange(await adminApi.uploadImage(file));
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">{label}</span>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input className={inputClass.replace("mt-1 ", "")} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder="Image URL" />
        <label className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#00786B]/30 px-4 py-2.5 text-sm font-bold text-[#00786B] hover:bg-[#00786B]/5">
          {busy ? "Uploading..." : "Upload image"}
          <input type="file" accept="image/*" disabled={busy} onChange={upload} className="sr-only" />
        </label>
      </div>
      {value && <img src={value} alt="" className="mt-3 h-28 w-full rounded-lg border border-neutral-200 bg-neutral-50 object-contain" />}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
