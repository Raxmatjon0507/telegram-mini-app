import { useState, useEffect } from "react";
import { api } from "../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api("GET", "/api/orders")
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api("PATCH", `/api/orders/${id}/status`, { status });
      load();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      await api("DELETE", `/api/orders/${id}`);
      load();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  const statusColors = {
    new: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  const statusLabels = {
    new: "Yangi",
    processing: "Jarayonda",
    completed: "Bajarildi",
    cancelled: "Bekor qilindi",
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Yuklanmoqda...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Buyurtmalar</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Buyurtmalar yo'q</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">#{o.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[o.status] || statusColors.new}`}>
                      {statusLabels[o.status] || o.status}
                    </span>
                  </div>
                  <p className="text-sm mt-1">Xizmat: <b>{o.service_name}</b></p>
                  <p className="text-sm text-gray-500">Foydalanuvchi: @{o.username || "anonim"} (ID: {o.user_id})</p>
                  <div className="text-xs text-gray-400 mt-2">{new Date(o.created_at).toLocaleString("uz-UZ")}</div>
                </div>
                <button onClick={() => handleDelete(o.id)} className="text-red-600 text-sm">🗑</button>
              </div>
              {o.status === "new" && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleStatus(o.id, "processing")} className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm">
                    Jarayonda
                  </button>
                  <button onClick={() => handleStatus(o.id, "completed")} className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm">
                    Bajarildi
                  </button>
                  <button onClick={() => handleStatus(o.id, "cancelled")} className="py-2 px-4 rounded-lg bg-red-100 text-red-600 text-sm">
                    Bekor
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
