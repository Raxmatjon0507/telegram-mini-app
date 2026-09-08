import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useState, useEffect } from "react";
import { ADMIN_ID } from "./config";
import { api } from "./api";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import ServicesPage from "./pages/ServicesPage";
import NewsPage from "./pages/NewsPage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminNews from "./pages/admin/AdminNews";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  const isAdmin = user && user.id === ADMIN_ID;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Routes>
          {isAdmin ? (
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          ) : (
            <Route path="/" element={<UserLayout />}>
              <Route index element={<ServicesPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          )}
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
