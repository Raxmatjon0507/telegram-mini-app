import { useState, useEffect } from "react";
import { api } from "../../api";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api("GET", "/api/complaints")
      .then(setComplaints)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleResolve = async (id) => {
    try {
      await api("PATCH", `/api/complaints/${id}/resolve`);
      load();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      await api("DELETE", `/api/complaints/${id}`);
      load();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Yuklanmoqda...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Shikoyatlar</h1>
      {complaints.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Shikoyatlar yo'q</div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">@{c.username || "anonim"}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "resolved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>
                      {c.status === "resolved" ? "Bajarildi" : "Kutilmoqda"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{c.text}</p>
                  <div className="text-xs text-gray-400 mt-2">{new Date(c.created_at).toLocaleString("uz-UZ")}</div>
                </div>
              </div>
              {c.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleResolve(c.id)} className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm">
                    ✓ Bajarildi
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="py-2 px-4 rounded-lg bg-red-100 text-red-600 text-sm">
                    🗑
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
