import { useState, useEffect } from "react";
import { api } from "../../api";

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });

  const load = () => {
    api("GET", "/api/news")
      .then(setNews)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", content: "" });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return alert("Sarlavha va matn shart");
    try {
      if (editing) {
        await api("PUT", `/api/news/${editing.id}`, form);
      } else {
        await api("POST", "/api/news", form);
      }
      setShowForm(false);
      load();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      await api("DELETE", `/api/news/${id}`);
      load();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Yuklanmoqda...</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Yangiliklar</h1>
        <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Qo'shish
        </button>
      </div>

      {news.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Hozircha yangiliklar yo'q</div>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.content}</p>
                  <div className="text-xs text-gray-400 mt-2">{new Date(item.created_at).toLocaleDateString("uz-UZ")}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-blue-600 text-sm">✏️</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 text-sm">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editing ? "Tahrirlash" : "Yangi yangilik"}</h3>
            <div className="space-y-3">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sarlavha *" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700" />
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Matn *" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-32 resize-none bg-gray-50 dark:bg-gray-700" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-600">Bekor qilish</button>
              <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-blue-600 text-white">Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
