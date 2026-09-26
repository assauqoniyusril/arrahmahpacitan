import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import LoginPage from "./pages/admin/LoginPage";
import NewsFormPage from "./pages/admin/NewsFormPage";
import NewsListPage from "./pages/admin/NewsListPage";
import HomePage from "./pages/HomePage";
import NewsDetailPage from "./pages/NewsDetailPage";

export default function App() {
  return <Routes><Route element={<PublicLayout />}><Route path="/" element={<HomePage />} /><Route path="/berita/:slug" element={<NewsDetailPage />} /></Route><Route path="/admin/login" element={<LoginPage />} /><Route element={<ProtectedRoute />}><Route path="/admin" element={<AdminLayout />}><Route index element={<DashboardPage />} /><Route path="berita" element={<NewsListPage />} /><Route path="berita/baru" element={<NewsFormPage />} /><Route path="berita/:id/edit" element={<NewsFormPage />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
