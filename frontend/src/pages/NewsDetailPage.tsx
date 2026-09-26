import { ArrowLeft, CalendarDays, Camera, Clock3, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NewsCard from "../components/NewsCard";
import { api, imageUrl } from "../lib/api";
import type { News } from "../types";

export default function NewsDetailPage() {
  const { slug = "" } = useParams();
  const [article, setArticle] = useState<News | null>(null);
  const [related, setRelated] = useState<News[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setArticle(null);
    setError("");
    api.getNews(slug).then((response) => { setArticle(response.data); setRelated(response.related); }).catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <div className="mx-auto max-w-3xl px-5 py-24 text-center"><span className="section-kicker">404</span><h1 className="mt-3 font-display text-4xl font-semibold">Reportase tidak ditemukan</h1><p className="mt-4 text-slate-500">{error}</p><Link className="mt-8 inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-xs font-bold text-white" to="/"><ArrowLeft size={15} /> Kembali ke beranda</Link></div>;
  if (!article) return <div className="mx-auto min-h-[70vh] max-w-6xl animate-pulse bg-violet-50" />;

  const paragraphs = article.content.split(/\n{2,}/).filter(Boolean);
  const readingTime = Math.max(2, Math.ceil(article.content.split(/\s+/).length / 200));

  return (
    <article className="bg-white">
      <header className="relative overflow-hidden px-5 pb-12 pt-14 text-center lg:px-8 lg:pb-16 lg:pt-20">
        <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <Link className="mb-9 inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-signal" to="/"><ArrowLeft size={14} /> Kembali ke beranda</Link>
          <span className="mx-auto block w-fit rounded-full border border-violet-200 bg-violet-50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.14em] text-signal">{article.category}</span>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.06] tracking-[-.04em] text-ink md:text-6xl">{article.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-500">{article.summary}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400"><span className="flex items-center gap-2"><CalendarDays size={14} className="text-signal" /> {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(article.created_at))}</span><span className="flex items-center gap-2"><Clock3 size={14} className="text-signal" /> {readingTime} menit baca</span><button className="flex items-center gap-2 transition hover:text-signal" onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}><Share2 size={14} className="text-signal" /> Bagikan</button></div>
        </div>
      </header>

      <figure className="px-0 md:px-5 lg:px-8"><div className="mx-auto max-w-6xl overflow-hidden md:rounded-2xl"><img src={imageUrl(article.featured_image)} alt={article.image_caption || article.title} className="max-h-[76vh] w-full object-cover" /></div>{article.image_caption && <figcaption className="mx-auto flex max-w-6xl gap-3 px-5 py-4 text-xs leading-5 text-slate-400 md:px-1"><Camera size={15} className="mt-0.5 shrink-0 text-signal" /> {article.image_caption}</figcaption>}</figure>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 lg:grid-cols-[150px_1fr] lg:px-8 lg:py-20">
        <aside className="hidden lg:block"><div className="sticky top-28 rounded-xl border border-violet-100 bg-[#faf9ff] p-4"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-signal">SDIT Ar Rahmah Pacitan</p><p className="mt-2 text-xs leading-5 text-slate-400">Cerita visual dengan konteks yang utuh.</p></div></aside>
        <div className="prose prose-lg max-w-3xl prose-headings:font-display prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-8 prose-a:text-signal prose-blockquote:border-signal prose-blockquote:bg-violet-50 prose-blockquote:py-2">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </div>

      {related.length > 0 && <section className="border-t border-violet-100 bg-[#f8f7fc] px-5 py-16 lg:px-8 lg:py-20"><div className="mx-auto max-w-6xl"><div className="mx-auto max-w-2xl text-center"><span className="section-kicker">Cerita terkait</span><h2 className="section-title">Lanjutkan melihat</h2></div><div className="mt-10 grid gap-6 md:grid-cols-3">{related.map((item) => <NewsCard news={item} key={item.id} />)}</div></div></section>}
    </article>
  );
}
