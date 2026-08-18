import { motion as Motion, useReducedMotion } from "framer-motion";

const metricLabels = {
  published: "Live now",
  homepage: "On homepage",
  drafts: "In draft",
};

export default function AdminOverview({ stats, projects, onNavigate }) {
  const reduceMotion = useReducedMotion();
  const recentProjects = projects.slice(0, 4);

  return (
    <Motion.section initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00786B]">Workspace / Overview</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-[#10201d] sm:text-5xl">Your work, from one quiet room.</h1>
        </div>
        <p className="max-w-xs text-sm leading-6 text-neutral-500">Publish, refine, and keep the public portfolio honest without touching source files.</p>
      </div>

      <div className="relative mt-10 overflow-hidden rounded-[2rem] bg-[#082e2a] text-white shadow-[0_28px_80px_rgba(8,46,42,0.18)]">
        <div aria-hidden="true" className="absolute -right-20 -top-36 h-[420px] w-[420px] rounded-full border border-[#72cfc1]/20" />
        <div aria-hidden="true" className="absolute right-8 top-8 h-52 w-52 rounded-full border border-dashed border-[#72cfc1]/20" />
        <div className="relative grid min-h-[350px] lg:grid-cols-[1.25fr_.75fr]">
          <div className="flex flex-col justify-between p-7 sm:p-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#72cfc1]"><span className="h-1.5 w-1.5 rounded-full bg-[#72cfc1]" /> Portfolio pulse</span>
              <h2 className="mt-8 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Everything visible is intentional. Everything else can stay a draft.</h2>
            </div>
            <button onClick={() => onNavigate("projects")} className="mt-10 flex w-fit items-center gap-4 text-sm font-semibold text-[#72cfc1] group"><span className="grid h-11 w-11 place-items-center rounded-full border border-[#72cfc1]/40 transition-all duration-300 group-hover:bg-[#72cfc1] group-hover:text-[#082e2a]">&rarr;</span> Open project studio</button>
          </div>

          <div className="relative flex items-center justify-center border-t border-white/10 p-8 lg:border-l lg:border-t-0">
            <div className="relative grid h-52 w-52 place-items-center rounded-full border border-[#72cfc1]/20 sm:h-60 sm:w-60">
              <div className="absolute inset-4 rounded-full border border-dashed border-white/10" />
              <div className="text-center"><span className="block text-7xl font-semibold tracking-[-0.08em]">{stats.total}</span><span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-[#72cfc1]">Total projects</span></div>
              <span className="absolute right-2 top-10 h-3 w-3 rounded-full bg-[#72cfc1] shadow-[0_0_0_8px_rgba(114,207,193,0.08)]" />
            </div>
          </div>
        </div>

        <dl className="relative grid border-t border-white/10 sm:grid-cols-3">
          {Object.entries(metricLabels).map(([key, label], index) => <Motion.div key={key} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.08 }} className="flex items-end justify-between border-b border-white/10 px-7 py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><div><dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</dt><dd className="mt-2 text-3xl font-semibold">{stats[key]}</dd></div><span className={`mb-1 h-2.5 w-2.5 rounded-full ${key === "drafts" ? "bg-[#d0a96b]" : "bg-[#72cfc1]"}`} /></Motion.div>)}
        </dl>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.35fr_.65fr]">
        <section className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 sm:px-8">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00786B]">Selected records</p><h2 className="mt-1 text-xl font-semibold">Project channel</h2></div>
            <button onClick={() => onNavigate("projects")} className="text-sm font-semibold text-[#00786B]">Manage all &rarr;</button>
          </div>
          <div>
            {recentProjects.map((project, index) => <button key={project.id || project.slug} onClick={() => onNavigate("projects")} className="group grid w-full grid-cols-[38px_1fr_auto] items-center gap-4 border-b border-black/[0.07] px-6 py-5 text-left last:border-b-0 hover:bg-[#00786B]/[0.04] sm:px-8"><span className="font-mono text-xs text-neutral-300">{String(index + 1).padStart(2, "0")}</span><div><p className="font-semibold transition-colors group-hover:text-[#00786B]">{project.name}</p><p className="mt-1 text-xs text-neutral-400">{project.category || project.section}</p></div><span className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider ${project.published ? "bg-[#00786B]/10 text-[#00675d]" : "bg-[#d0a96b]/15 text-[#8a682f]"}`}>{project.published ? "Live" : "Draft"}</span></button>)}
          </div>
        </section>

        <aside className="relative overflow-hidden rounded-[1.75rem] bg-[#d8d1bf] p-7 sm:p-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5d594e]">Publishing note</span>
          <p className="mt-5 text-2xl font-semibold leading-snug tracking-[-0.025em]">Make the proof easy to find.</p>
          <p className="mt-4 text-sm leading-7 text-[#5d594e]">Keep live links, GitHub evidence, screenshots, and case-study details current. Archive work that no longer represents you.</p>
          <div className="mt-8 h-px bg-black/10" />
          <button onClick={() => onNavigate("content")} className="mt-6 text-sm font-semibold text-[#27423d]">Refine site content &rarr;</button>
          <div aria-hidden="true" className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full border-[22px] border-white/20" />
        </aside>
      </div>
    </Motion.section>
  );
}
