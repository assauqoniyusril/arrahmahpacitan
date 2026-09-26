import { ArrowUpRight, Image, Newspaper, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { News } from "../../types";

export default function DashboardPage() {
  const [news, setNews] = useState<News[]>([]);
  useEffect(() => { api.adminNews("limit=5").then((r) => setNews(r.data)).catch(() => undefined); }, []);
  const published = news.filter((item) => item.published).length;
  return <div className="bg-[#F8F4E8] p-5 md:p-8 lg:p-12"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-signal">Ruang Redaksi</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">Ringkasan konten</h1></div><Link to="/admin/berita/baru" className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-bold text-paper transition hover:bg-[#22381E]"><Plus size={18} /> Tulis reportase</Link></div><div className="mt-10 grid gap-5 sm:grid-cols-3"><Stat icon={<Newspaper />} label="Konten terbaru" value={news.length} /><Stat icon={<ArrowUpRight />} label="Sudah terbit" value={published} /><Stat icon={<Image />} label="Fokus visual" value="100%" /></div><section className="mt-10 rounded-3xl bg-[#FFFDF6] p-6 shadow-[0_18px_40px_rgba(27,44,20,0.06)]"><div className="mb-6 flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">Pembaruan terakhir</h2><Link to="/admin/berita" className="text-sm font-bold text-signal">Lihat semua</Link></div><div className="divide-y divide-ink/10">{news.map((item) => <Link to={`/admin/berita/${item.id}/edit`} key={item.id} className="flex items-center justify-between gap-5 py-4 transition hover:text-signal"><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-xs text-ink/45">{item.category} · {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.updated_at))}</p></div><ArrowUpRight size={18} className="shrink-0 text-ink/35" /></Link>)}{news.length === 0 && <p className="py-8 text-center text-sm text-ink/45">Belum ada berita.</p>}</div></section></div>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return <div className="rounded-3xl bg-[#FFFDF6] p-6 shadow-[0_18px_30px_rgba(27,44,20,0.05)]"><div className="mb-7 grid h-11 w-11 place-items-center rounded-full bg-signal/10 text-signal">{icon}</div><p className="font-display text-4xl font-semibold">{value}</p><p className="mt-2 text-sm text-ink/45">{label}</p></div>;
}
