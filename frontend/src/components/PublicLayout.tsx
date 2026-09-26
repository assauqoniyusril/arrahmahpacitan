import { Aperture, ArrowUpRight, Instagram, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Beranda", to: "/" },
  { label: "Peristiwa", to: "/?category=Peristiwa" },
  { label: "Humaniora", to: "/?category=Humaniora" },
  { label: "Budaya", to: "/?category=Budaya" },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
    setSearchOpen(false);
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="sticky top-0 z-50 border-b border-violet-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 font-display text-[15px] font-bold tracking-tight text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal text-white shadow-sm shadow-signal/30"><Aperture size={17} /></span>
            SDIT Ar Rahmah<span className="-ml-2 text-signal">Pacitan</span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] font-medium text-slate-600 md:flex">
            {navItems.map((item) => <Link key={item.label} className="transition hover:text-signal" to={item.to}>{item.label}</Link>)}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-signal" aria-label="Cari berita"><Search size={17} /></button>
            <Link to="/admin" className="hidden items-center gap-2 rounded-lg bg-signal px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-signal/20 transition hover:-translate-y-0.5 hover:bg-signalDark sm:inline-flex">Ruang Redaksi <ArrowUpRight size={14} /></Link>
            <button className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka navigasi">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </div>

        {searchOpen && <form onSubmit={submitSearch} className="border-t border-violet-100 bg-violet-50/80 px-5 py-4"><div className="mx-auto flex max-w-2xl items-center rounded-xl border border-violet-200 bg-white px-4 shadow-sm"><Search size={17} className="text-signal" /><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" placeholder="Cari judul, peristiwa, atau kata kunci..." /><button className="text-xs font-bold text-signal">Cari</button></div></form>}
        {menuOpen && <nav className="space-y-1 border-t border-violet-100 bg-white px-5 py-4 md:hidden">{navItems.map((item) => <Link onClick={() => setMenuOpen(false)} key={item.label} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-violet-50 hover:text-signal" to={item.to}>{item.label}</Link>)}<Link onClick={() => setMenuOpen(false)} className="mt-2 block rounded-lg bg-signal px-3 py-3 text-center text-sm font-bold text-white" to="/admin">Ruang Redaksi</Link></nav>}
      </header>

      <main><Outlet /></main>

      <footer className="border-t border-violet-100 bg-[#faf9ff]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
          <div><div className="mb-4 flex items-center gap-2.5 font-display text-lg font-bold"><span className="grid h-9 w-9 place-items-center rounded-lg bg-signal text-white"><Aperture size={18} /></span> Reportase<span className="-ml-2 text-signal">Foto</span></div><p className="max-w-sm text-sm leading-7 text-slate-500">Merekam peristiwa dan menjaga ingatan melalui jurnalisme visual yang dekat dengan manusia.</p></div>
          <div><p className="mb-4 text-[11px] font-bold uppercase tracking-[.16em] text-ink">Jelajahi</p><div className="space-y-3 text-sm text-slate-500"><Link className="block hover:text-signal" to="/">Berita terbaru</Link><Link className="block hover:text-signal" to="/?category=Budaya">Budaya</Link><Link className="block hover:text-signal" to="/?category=Lingkungan">Lingkungan</Link></div></div>
          <div><p className="mb-4 text-[11px] font-bold uppercase tracking-[.16em] text-ink">Terhubung</p><p className="flex items-center gap-2 text-sm text-slate-500"><Instagram size={16} className="text-signal" /> @reportasefoto</p><p className="mt-3 text-sm text-slate-500">redaksi@reportasefoto.id</p></div>
        </div>
        <div className="border-t border-violet-100 px-5 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} Reportase Foto. Cerita yang layak diingat.</div>
      </footer>
    </div>
  );
}
