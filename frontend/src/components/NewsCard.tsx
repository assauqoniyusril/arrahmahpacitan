import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { imageUrl } from "../lib/api";
import type { News } from "../types";

export default function NewsCard({ news, priority = false }: { news: News; priority?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_8px_30px_rgba(76,29,149,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(76,29,149,0.11)]">
      <Link to={`/berita/${news.slug}`} className="block overflow-hidden bg-violet-50">
        <img src={imageUrl(news.featured_image)} alt={news.image_caption || news.title} loading={priority ? "eager" : "lazy"} className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105" />
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3"><span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-signal">{news.category}</span><span className="text-[11px] text-slate-400">{new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(news.created_at))}</span></div>
        <Link to={`/berita/${news.slug}`}><h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-ink transition group-hover:text-signal">{news.title}</h3></Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{news.summary}</p>
        <Link to={`/berita/${news.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-signal">Baca selengkapnya <ArrowRight size={14} className="transition group-hover:translate-x-1" /></Link>
      </div>
    </article>
  );
}
