import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, imageUrl } from "../../lib/api";
import type { News } from "../../types";

export default function NewsListPage() {
  const [news, setNews] = useState<News[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const load = () => api.adminNews(search ? `search=${encodeURIComponent(search)}` : "").then((r) => setNews(r.data)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function remove(item: News) {
    if (!window.confirm(`Hapus "${item.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try { await api.deleteNews(item.id); setNews((current) => current.filter((news) => news.id !== item.id)); }
    catch (e) { setError(e instanceof Error ? e.message : "Gagal menghapus"); }
  }

  return <div className="bg-[#F8F4E8] p-5 md:p-8 lg:p-12"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-signal">Manajemen konten</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Semua berita</h1></div><Link to="/admin/berita/baru" className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-paper transition hover:bg-[#22381E]"><Plus size={18} /> Berita baru</Link></div><form onSubmit={(e) => { e.preventDefault(); load(); }} className="mt-8 flex max-w-lg rounded-xl border border-ink/10 bg-[#FFFDF6] p-2 shadow-sm"><Search className="ml-2 mt-2 text-ink/35" size={19} /><input value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-0 flex-1 px-3 outline-none" placeholder="Cari judul atau kategori" /><button className="rounded-lg bg-ink px-4 py-2 text-xs font-bold text-paper">Cari</button></form>{error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<div className="mt-8 overflow-hidden rounded-3xl bg-[#FFFDF6] shadow-[0_18px_40px_rgba(27,44,20,0.06)]"><div className="hidden grid-cols-[88px_1fr_140px_110px] gap-4 border-b border-ink/10 px-5 py-4 text-[10px] font-bold uppercase tracking-[.18em] text-ink/40 md:grid"><span>Gambar</span><span>Berita</span><span>Status</span><span>Aksi</span></div>{news.map((item) => <div key={item.id} className="grid gap-4 border-b border-ink/10 p-5 last:border-0 md:grid-cols-[88px_1fr_140px_110px] md:items-center"><img src={imageUrl(item.featured_image)} alt="" className="h-16 w-24 rounded-lg object-cover md:w-full" /><div><p className="font-semibold leading-snug">{item.title}</p><p className="mt-1 text-xs text-ink/45">{item.category} · {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.updated_at))}</p></div><span className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${item.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{item.published ? "Terbit" : "Draf"}</span><div className="flex gap-2"><Link aria-label="Edit" to={`/admin/berita/${item.id}/edit`} className="rounded-lg bg-ink/5 p-2 hover:bg-ink hover:text-paper"><Edit3 size={17} /></Link><button aria-label="Hapus" onClick={() => remove(item)} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-600 hover:text-paper"><Trash2 size={17} /></button></div></div>)}{news.length === 0 && <p className="p-12 text-center text-sm text-ink/45">Belum ada berita yang cocok.</p>}</div></div>;
}
