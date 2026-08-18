import { Link } from "react-router-dom";

const navigation = [
  { id: "overview", label: "Overview", short: "Home", path: "M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-3H4v3Zm10-13h6V4h-6v3Z" },
  { id: "projects", label: "Projects", short: "Work", path: "m8 3 1.6 3.2L13 8l-3.4 1.8L8 13l-1.6-3.2L3 8l3.4-1.8L8 3Zm8 8 1.3 2.7L20 15l-2.7 1.3L16 19l-1.3-2.7L12 15l2.7-1.3L16 11ZM5 14l.9 1.9L8 17l-2.1 1.1L5 20l-.9-1.9L2 17l2.1-1.1L5 14Z" },
  { id: "resumes", label: "R?sum?s", short: "CVs", path: "M6 2h9l5 5v15H6V2Zm8 2v5h4M9 13h8M9 17h8M9 9h2" },
  { id: "content", label: "Site content", short: "Content", path: "M5 4h14v3H5V4Zm0 6h14v3H5v-3Zm0 6h9v3H5v-3Z" },
  { id: "security", label: "Security", short: "Secure", path: "M12 2 4 5v6c0 5.1 3.4 9.8 8 11 4.6-1.2 8-5.9 8-11V5l-8-3Zm0 5a3 3 0 0 1 1 5.8V16h-2v-3.2A3 3 0 0 1 12 7Z" },
];

function NavIcon({ path }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d={path} /></svg>;
}

export default function AdminShell({ active, onNavigate, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[#f1f0ea] text-[#15201e] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#082e2a] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div aria-hidden="true" className="absolute -right-24 -top-20 h-64 w-64 rounded-full border border-[#72cfc1]/20" />
        <div aria-hidden="true" className="absolute -right-10 top-10 h-40 w-40 rounded-full border border-[#72cfc1]/10" />
        <div className="relative px-7 pb-8 pt-9">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#72cfc1]/50 font-mono text-sm font-bold text-[#72cfc1]">JM</span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#72cfc1]">Private studio</p>
              <p className="mt-1 text-sm font-semibold">Portfolio control</p>
            </div>
          </div>
        </div>

        <div className="relative mx-7 h-px bg-white/10"><span className="absolute left-0 top-0 h-px w-12 bg-[#72cfc1]" /></div>

        <nav className="relative mt-10 px-4" aria-label="Administration">
          <div className="absolute bottom-7 left-[42px] top-7 w-px bg-white/10" />
          {navigation.map((item, index) => {
            const selected = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative mb-2 grid w-full grid-cols-[38px_1fr_auto] items-center gap-3 rounded-2xl px-3 py-4 text-left transition-all duration-300 ${selected ? "bg-white text-[#082e2a] shadow-[0_18px_40px_rgba(0,0,0,0.18)]" : "text-white/55 hover:bg-white/[0.06] hover:text-white"}`}
              >
                <span className={`relative z-10 grid h-7 w-7 place-items-center rounded-full border font-mono text-[10px] transition-colors ${selected ? "border-[#00786B] bg-[#00786B] text-white" : "border-white/20 bg-[#082e2a]"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm font-semibold">{item.label}</span>
                <span className={`transition-transform duration-300 ${selected ? "translate-x-0 text-[#00786B]" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>&rarr;</span>
              </button>
            );
          })}
        </nav>

        <div className="relative mt-auto p-7">
          <div className="mb-6 rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="flex items-center gap-2 text-xs text-white/65"><span className="h-2 w-2 animate-pulse rounded-full bg-[#72cfc1] motion-reduce:animate-none" /> Studio services</div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">Neon + Cloudinary</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/" target="_blank" className="rounded-xl border border-white/15 px-3 py-2.5 text-center text-xs font-semibold text-white/70 transition-colors hover:border-[#72cfc1]/60 hover:text-white">View site</Link>
            <button onClick={onLogout} className="rounded-xl bg-[#72cfc1] px-3 py-2.5 text-xs font-bold text-[#082e2a] transition-colors hover:bg-white">Sign out</button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-black/10 px-5 py-4 lg:hidden">
          <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#082e2a] font-mono text-xs font-bold text-[#72cfc1]">JM</span><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#00786B]">Private studio</p><p className="text-sm font-bold">Portfolio control</p></div></div>
          <div className="flex gap-2"><Link to="/" target="_blank" className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold">View</Link><button onClick={onLogout} className="rounded-full bg-[#082e2a] px-3 py-2 text-xs font-semibold text-white">Exit</button></div>
        </header>

        <main className="mx-auto min-h-screen max-w-[1600px] px-5 pb-28 pt-8 sm:px-8 lg:px-10 lg:pb-12 lg:pt-10 xl:px-14">
          {children}
        </main>

        <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-2xl border border-white/20 bg-[#082e2a]/95 p-2 text-white shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Administration">
          {navigation.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold transition-colors ${active === item.id ? "bg-[#72cfc1] text-[#082e2a]" : "text-white/55"}`}><NavIcon path={item.path} />{item.short}</button>)}
        </nav>
      </div>
    </div>
  );
}
