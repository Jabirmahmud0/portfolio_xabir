import { useState } from "react";
import { adminApi } from "./adminApi.js";

const inputClass = "mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-[#00786B] focus:ring-2 focus:ring-[#00786B]/15";

export default function SecuritySettings({ onPasswordChanged }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmation) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 4) {
      setError("New password must contain at least 4 characters.");
      return;
    }
    setBusy(true);
    try {
      await adminApi.changePassword({ currentPassword, newPassword });
      onPasswordChanged();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-2xl">
      <p className="text-sm font-semibold text-[#00786B]">Account security</p>
      <h1 className="mt-2 text-3xl font-bold">Change admin password</h1>
      <p className="mt-3 leading-7 text-neutral-600">
        The minimum is 4 characters, though a longer password is safer. Changing it invalidates every existing admin session, including this one.
      </p>

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <label className="block text-sm font-bold text-neutral-800">
          Current password
          <input type={showPasswords ? "text" : "password"} required maxLength="128" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className={inputClass} />
        </label>
        <label className="mt-6 block text-sm font-bold text-neutral-800">
          New password
          <input type={showPasswords ? "text" : "password"} required minLength="4" maxLength="128" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClass} />
        </label>
        <label className="mt-6 block text-sm font-bold text-neutral-800">
          Confirm new password
          <input type={showPasswords ? "text" : "password"} required minLength="4" maxLength="128" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={inputClass} />
        </label>
        <label className="mt-5 flex items-center gap-2 text-sm text-neutral-600">
          <input type="checkbox" checked={showPasswords} onChange={(event) => setShowPasswords(event.target.checked)} className="h-4 w-4 accent-[#00786B]" />
          Show passwords
        </label>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="mt-7 rounded-xl bg-[#00786B] px-5 py-3 font-bold text-white hover:bg-[#00675d] disabled:opacity-50">
          {busy ? "Changing password..." : "Change password"}
        </button>
      </form>
    </section>
  );
}
