import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "./adminApi.js";
import AdminShell from "./AdminShell.jsx";
import AdminOverview from "./AdminOverview.jsx";
import ProjectManager from "./ProjectManager.jsx";
import ContentManager from "./ContentManager.jsx";
import SecuritySettings from "./SecuritySettings.jsx";
import ResumeManager from "./ResumeManager.jsx";

function Login({ onSuccess, notice }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminApi.login({ password });
      onSuccess();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-[#082e2a] px-6 text-white lg:grid-cols-[1fr_1fr]">
      <div aria-hidden="true" className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full border border-[#72cfc1]/15" />
      <section className="relative hidden items-end p-16 lg:flex">
        <div className="max-w-xl"><p className="font-mono text-xs uppercase tracking-[0.24em] text-[#72cfc1]">Jabir / private studio</p><h1 className="mt-7 text-6xl font-semibold leading-[1.02] tracking-[-0.055em]">The quiet side of the portfolio.</h1><p className="mt-7 max-w-md leading-7 text-white/50">A private room for shaping the work everyone else sees.</p></div>
      </section>
      <section className="relative grid place-items-center py-12">
        <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="mb-9 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full border border-[#72cfc1]/50 font-mono text-sm font-bold text-[#72cfc1]">JM</span><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#72cfc1]">Restricted access</p><p className="mt-1 font-semibold">Portfolio control</p></div></div>
          {notice && <p className="mb-5 rounded-xl bg-[#72cfc1]/10 px-4 py-3 text-sm text-[#a6e2d9]">{notice}</p>}
          <label className="block text-sm font-semibold text-white/70">Studio password<input type="password" required autoComplete="current-password" autoFocus value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3.5 text-white outline-none transition focus:border-[#72cfc1]" /></label>
          {error && <p className="mt-4 rounded-xl bg-red-950/60 px-4 py-3 text-sm text-red-200">{error}</p>}
          <button disabled={busy} className="mt-7 w-full rounded-xl bg-[#72cfc1] px-4 py-3.5 font-bold text-[#082e2a] transition-colors hover:bg-white disabled:opacity-50">{busy ? "Opening studio..." : "Enter studio"}</button>
          <Link to="/" className="mt-6 block text-center text-sm text-white/40 transition-colors hover:text-white">Return to public portfolio</Link>
        </form>
      </section>
    </main>
  );
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(null);
  const [tab, setTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const previousTitle = document.title;
    const existing = document.head.querySelector('meta[name="robots"]');
    const previousRobots = existing?.getAttribute("content");
    const robots = existing || document.createElement("meta");
    if (!existing) {
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, nofollow, noarchive");
    document.title = "Portfolio studio";
    return () => {
      document.title = previousTitle;
      if (existing && previousRobots) robots.setAttribute("content", previousRobots);
      else robots.remove();
    };
  }, []);

  async function load() {
    setError("");
    try {
      const [projectData, sectionData] = await Promise.all([adminApi.projects(), adminApi.sections()]);
      setProjects(projectData.projects);
      setSections(sectionData.sections);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  useEffect(() => {
    adminApi.session()
      .then(({ authenticated: value }) => {
        setAuthenticated(value);
        if (value) load();
      })
      .catch(() => setAuthenticated(false));
  }, []);

  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter((item) => item.published).length,
    homepage: projects.filter((item) => item.homepage).length,
    drafts: projects.filter((item) => !item.published).length,
  }), [projects]);

  async function logout() {
    await adminApi.logout();
    setAuthenticated(false);
  }

  if (authenticated === null) return <div className="grid min-h-screen place-items-center bg-[#082e2a] font-mono text-xs uppercase tracking-[0.2em] text-[#72cfc1]">Opening private studio...</div>;
  if (!authenticated) return <Login notice={notice} onSuccess={() => { setNotice(""); setAuthenticated(true); load(); }} />;

  return (
    <AdminShell active={tab} onNavigate={setTab} onLogout={logout}>
      {error && <div className="mb-7 rounded-2xl border border-[#d0a96b]/40 bg-[#d0a96b]/10 p-4 text-sm text-[#745725]"><strong>Studio connection:</strong> {error}</div>}
      {tab === "overview" && <AdminOverview stats={stats} projects={projects} onNavigate={setTab} />}
      {tab === "projects" && <ProjectManager projects={projects} onChange={setProjects} />}
      {tab === "resumes" && <ResumeManager sections={sections} onChange={setSections} />}
      {tab === "content" && <ContentManager sections={sections} onChange={setSections} />}
      {tab === "security" && <SecuritySettings onPasswordChanged={() => { setNotice("Password changed successfully. Sign in with your new password."); setAuthenticated(false); setTab("overview"); }} />}
    </AdminShell>
  );
}
