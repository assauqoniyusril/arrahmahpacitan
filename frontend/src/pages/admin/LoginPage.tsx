import { Aperture, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/admin" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try { await login(email, password); navigate((location.state as { from?: { pathname?: string } })?.from?.pathname || "/admin", { replace: true }); }
    catch (err) { setError(err instanceof Error ? err.message : "Login gagal"); }
    finally { setLoading(false); }
  }

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img className="h-full w-full object-cover opacity-60" src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=85" alt="Ruang redaksi" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-lg text-paper">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-signal">Ruang Redaksi</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-paper">Cerita yang kuat dimulai dari pengelolaan yang rapi.</h1>
        </div>
      </div>
      <div className="flex items-center justify-center bg-ink px-6 py-12">
        <form onSubmit={submit} className="w-full max-w-md text-paper">
          <div className="mb-12 flex items-center gap-3 font-display text-xl font-bold">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-signal text-ink"><Aperture /></span>
            REPORTASE FOTO
          </div>
          <h2 className="font-display text-4xl font-semibold tracking-tight">Masuk ke dashboard</h2>
          <p className="mt-3 text-sm text-paper/55">Gunakan akun administrator yang ditentukan pada environment.</p>
          {error && <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}
          <label className="mt-8 block text-xs font-bold uppercase tracking-[.16em] text-paper/55">
            Email
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-3 w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-4 text-base text-paper outline-none focus:border-signal" placeholder="admin@example.com" />
          </label>
          <label className="mt-5 block text-xs font-bold uppercase tracking-[.16em] text-paper/55">
            Kata sandi
            <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 w-full rounded-xl border border-paper/15 bg-paper/5 px-4 py-4 text-base text-paper outline-none focus:border-signal" />
          </label>
          <button disabled={loading} className="mt-7 flex w-full items-center justify-between rounded-xl bg-signal px-5 py-4 font-bold text-ink disabled:opacity-50">
            <span>{loading ? "Memeriksa..." : "Masuk ke redaksi"}</span>
            <ArrowRight size={19} />
          </button>
        </form>
      </div>
    </div>
  );
}
