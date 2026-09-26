import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, imageUrl } from "../../lib/api";
import type { NewsPayload } from "../../types";

const initial: NewsPayload = { title: "", summary: "", content: "", featured_image: "", image_caption: "", category: "Peristiwa", published: true };

export default function NewsFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<NewsPayload>(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const preview = useMemo(() => imageFile ? URL.createObjectURL(imageFile) : imageUrl(form.featured_image), [imageFile, form.featured_image]);

  useEffect(() => {
    if (!id) return;
    api.adminNewsById(id).then(({ data }) => setForm({ title: data.title, summary: data.summary, content: data.content, featured_image: data.featured_image, image_caption: data.image_caption, category: data.category, published: data.published })).catch((e) => setError(e.message));
  }, [id]);
  useEffect(() => () => { if (imageFile) URL.revokeObjectURL(preview); }, [imageFile, preview]);

  function field<K extends keyof NewsPayload>(key: K, value: NewsPayload[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      let featuredImage = form.featured_image;
      if (imageFile) featuredImage = (await api.uploadImage(imageFile)).url;
      const payload = { ...form, featured_image: featuredImage };
      if (id) await api.updateNews(id, payload); else await api.createNews(payload);
      navigate("/admin/berita");
    } catch (err) { setError(err instanceof Error ? err.message : "Gagal menyimpan berita"); }
    finally { setSaving(false); }
  }

  return <div className="bg-[#F8F4E8] p-5 md:p-8 lg:p-12"><Link to="/admin/berita" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-ink/45 hover:text-ink"><ArrowLeft size={15} /> Kembali</Link><div className="mt-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-signal">Editor reportase</p><h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{id ? "Edit berita" : "Tulis berita baru"}</h1></div>{error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}<form onSubmit={submit} className="mt-8 grid gap-7 xl:grid-cols-[1fr_360px]"><div className="space-y-6 rounded-3xl bg-[#FFFDF6] p-5 shadow-[0_18px_40px_rgba(27,44,20,0.05)] md:p-8"><Field label="Judul berita"><input required minLength={5} maxLength={240} value={form.title} onChange={(e) => field("title", e.target.value)} className="input" placeholder="Judul yang kuat dan informatif" /></Field><div className="grid gap-5 md:grid-cols-2"><Field label="Kategori"><input required maxLength={100} value={form.category} onChange={(e) => field("category", e.target.value)} className="input" placeholder="Peristiwa" /></Field><Field label="Status"><select value={form.published ? "published" : "draft"} onChange={(e) => field("published", e.target.value === "published")} className="input"><option value="published">Terbit</option><option value="draft">Draf</option></select></Field></div><Field label="Ringkasan"><textarea required minLength={10} rows={4} value={form.summary} onChange={(e) => field("summary", e.target.value)} className="input resize-y" placeholder="Ringkasan singkat untuk kartu berita dan pengantar artikel." /></Field><Field label="Isi reportase"><textarea required minLength={20} rows={18} value={form.content} onChange={(e) => field("content", e.target.value)} className="input resize-y font-serif leading-7" placeholder={"Tulis isi reportase.\n\nPisahkan paragraf dengan satu baris kosong."} /><p className="mt-2 text-xs text-ink/40">Pisahkan paragraf dengan baris kosong. Editor akan menampilkan tipografi artikel secara otomatis.</p></Field></div><aside className="space-y-6"><div className="rounded-3xl bg-[#FFFDF6] p-5 shadow-[0_18px_40px_rgba(27,44,20,0.05)]"><p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-ink/45">Foto utama</p><div className="relative overflow-hidden rounded-xl bg-ink/5"><img src={preview} alt="Pratinjau gambar" className="aspect-[4/3] w-full object-cover" /></div><label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 px-4 py-4 text-sm font-bold hover:border-signal hover:text-signal"><ImagePlus size={18} /> Pilih gambar<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /></label><p className="mt-2 text-xs text-ink/40">JPG, PNG, atau WebP. Maksimum sesuai MAX_UPLOAD_MB.</p><Field label="Caption foto"><textarea rows={3} value={form.image_caption} onChange={(e) => field("image_caption", e.target.value)} className="input resize-y" placeholder="Keterangan foto, lokasi, dan kredit fotografer." /></Field></div><button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-signal px-5 py-4 font-bold text-ink shadow-lg shadow-signal/20 disabled:opacity-50"><Save size={18} /> {saving ? "Menyimpan..." : "Simpan berita"}</button></aside></form></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-ink/45">{label}</span>{children}</label>; }
