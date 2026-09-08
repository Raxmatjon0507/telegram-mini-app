import { useState, useEffect } from "react";
import { api } from "../../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ services: 0, news: 0, orders: 0, complaints: 0 });

  useEffect(() => {
    Promise.all([
      api("GET", "/api/services"),
      api("GET", "/api/news"),
      api("GET", "/api/orders"),
      api("GET", "/api/complaints"),
    ]).then(([services, news, orders, complaints]) => {
      setStats({
        services: services.length,
        news: news.length,
        orders: orders.length,
        complaints: complaints.filter((c) => c.status === "pending").length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: "Xizmatlar", value: stats.services, color: "bg-blue-500" },
    { label: "Yangiliklar", value: stats.news, color: "bg-green-500" },
    { label: "Buyurtmalar", value: stats.orders, color: "bg-purple-500" },
    { label: "Shikoyatlar", value: stats.complaints, color: "bg-red-500" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Boshqaruv paneli</h1>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className={`text-white ${c.color} w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-2`}>
              {c.label === "Xizmatlar" && "🛠"}
              {c.label === "Yangiliklar" && "📰"}
              {c.label === "Buyurtmalar" && "📋"}
              {c.label === "Shikoyatlar" && "⚠️"}
            </div>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
