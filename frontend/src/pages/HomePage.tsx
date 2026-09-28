import { ArrowRight, Camera, CheckCircle2, Images, Search, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import NewsCard from "../components/NewsCard";
import { api, imageUrl } from "../lib/api";
import type { News } from "../types";

const fallbackImages = [
  "https://whatsapp.com/channel/0029Vb8xaJJHbFVAdaxz2e0h/206?auto=format&fit=crop&w=900&q=85",
  "https://whatsapp.com/channel/0029Vb8xaJJHbFVAdaxz2e0h/187?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=85",
];

export default function HomePage() {
  const [params, setParams] = useSearchParams();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(params.get("search") || "");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.listNews(params.toString()).then((response) => setNews(response.data)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [params]);

  const hero = news[0];
  const articles = news.slice(1);
  const gallery = useMemo(() => fallbackImages.map((fallback, index) => news[index]?.featured_image ? imageUrl(news[index].featured_image) : fallback), [news]);

  return (
    <>
      <section className="relative overflow-hidden bg-white pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-2 text-[11px] font-bold text-signal"><Sparkles size={13} /> Kenal dari dekat</span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.04] tracking-[-.045em] text-ink md:text-6xl lg:text-[68px]">Setiap aktivitas adalah saksi perjalanan <span className="text-signal">masa depan.</span> Kami membawanya lebih dekat kepada Anda.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">Dokumentasi kejujuran ekspresi, adab, dan proses bertumbuh—menyajikan cerita utuh di balik setiap kegiatan keluarga besar SDIT Ar Rahmah Pacitan.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"><a href="#reportase" className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-xs font-bold text-white shadow-lg shadow-signal/20 transition hover:-translate-y-0.5 hover:bg-signalDark">Jelajahi reportase <ArrowRight size={14} /></a><Link to="/?category=Humaniora" className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:border-signal hover:text-signal"><Camera size={14} /> Cerita humaniora</Link></div>
        </div>

        <div className="mx-auto mt-14 grid max-w-[1440px] grid-cols-[.7fr_1.15fr_.8fr_1.15fr_.7fr] items-center gap-3 px-0 md:gap-4">
          {gallery.map((src, index) => <div key={src} className={`overflow-hidden bg-violet-50 ${index === 2 ? "rounded-2xl" : "rounded-xl"}`}><img src={src} alt="Potongan reportase visual" className={`w-full object-cover ${index === 2 ? "aspect-[4/3]" : "aspect-[4/3] md:aspect-[5/3]"}`} /></div>)}
        </div>
      </section>

      <section className="bg-[#f8f7fc] px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center"><span className="section-kicker">Tentang kami</span><h2 className="section-title">Merekam momen, merawat fitrah.</h2><p className="section-copy">Kami percaya setiap bingkai foto bukan sekadar dokumentasi visual.</p><Link to="/?category=Humaniora" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-xs font-bold text-white">Kenali cerita kami <ArrowRight size={14} /></Link></div>

          <div className="relative mx-auto mt-12 max-w-5xl pb-10">
            <img src={hero ? imageUrl(hero.featured_image) : fallbackImages[0]} alt={hero?.image_caption || "Reportase utama"} className="aspect-[16/8] w-full rounded-2xl object-cover shadow-[0_22px_65px_rgba(54,30,120,0.12)]" />
            <div className="absolute inset-x-5 bottom-0 grid grid-cols-2 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-xl shadow-violet-900/5 md:left-1/2 md:right-auto md:w-[72%] md:-translate-x-1/2 md:grid-cols-4">
              <Stat value="500+" label="Cerita visual" />
              <Stat value="42" label="Kota terjangkau" />
              <Stat value="18" label="Fotografer" />
              <Stat value="1,2 jt" label="Pembaca" />
            </div>
          </div>
        </div>
      </section>

      <section id="reportase" className="scroll-mt-20 bg-white px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center"><span className="section-kicker">Reportase terbaru</span><h2 className="section-title">Cerita pilihan dari lapangan</h2><p className="section-copy">Dari perubahan kecil di sudut kampung hingga peristiwa yang menggerakkan banyak orang.</p></div>
          <form onSubmit={(event) => { event.preventDefault(); const next = new URLSearchParams(params); search ? next.set("search", search) : next.delete("search"); setParams(next); }} className="mx-auto mt-8 flex max-w-md items-center rounded-xl border border-violet-100 bg-[#faf9ff] px-4 shadow-sm"><Search size={16} className="text-signal" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari reportase..." className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" /><button className="text-xs font-bold text-signal">Cari</button></form>
          {error && <p className="mx-auto mt-8 max-w-2xl rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">{error}</p>}
          {loading ? <div className="mt-12 grid gap-6 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-violet-50" />)}</div> : <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map((item) => <NewsCard news={item} key={item.id} />)}</div>}
          {!loading && articles.length === 0 && hero && <div className="mt-12 max-w-md"><NewsCard news={hero} /></div>}
        </div>
      </section>

      {hero && <section className="px-5 pb-20 lg:px-8 lg:pb-24"><div className="mx-auto grid max-w-6xl items-center overflow-hidden rounded-2xl border border-violet-100 bg-[#f5f1ff] md:grid-cols-[1fr_.8fr]"><div className="p-8 md:p-12"><span className="section-kicker">Sorotan pekan ini</span><h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{hero.title}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">{hero.summary}</p><Link to={`/berita/${hero.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-xs font-bold text-white">Baca reportase <ArrowRight size={14} /></Link></div><img src={imageUrl(hero.featured_image)} alt={hero.image_caption || hero.title} className="h-full min-h-72 w-full object-cover" /></div></section>}

      <section className="bg-[#f8f7fc] px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          <Value icon={<Images size={19} />} title="Visual sebagai saksi" text="Foto dipilih karena kekuatan informasinya, bukan sekadar keindahannya." />
          <Value icon={<CheckCircle2 size={19} />} title="Konteks yang utuh" text="Setiap gambar dilengkapi narasi agar pembaca memahami ruang dan peristiwa." />
          <Value icon={<Users size={19} />} title="Manusia di pusat cerita" text="Kami bekerja dengan empati dan menghormati martabat setiap subjek." />
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="border-b border-r border-violet-100 px-4 py-5 text-center last:border-r-0 md:border-b-0"><p className="font-display text-2xl font-semibold text-signal">{value}</p><p className="mt-1 text-[10px] font-medium text-slate-400">{label}</p></div>;
}

function Value({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-violet-100 bg-white p-6"><span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50 text-signal">{icon}</span><h3 className="mt-5 font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>;
}
