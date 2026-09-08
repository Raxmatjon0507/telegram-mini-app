import { useState, useEffect } from "react";
import { api } from "../../api";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", image_url: "" });

  const load = () => {
    api("GET", "/api/services")
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", category: "", image_url: "" });
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description, price: String(s.price), category: s.category, image_url: s.image_url });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) return alert("Nomi va narxi shart");
    try {
      const body = { ...form, price: Number(form.price) };
      if (editing) {
        await api("PUT", `/api/services/${editing.id}`, body);
      } else {
        await api("POST", "/api/services", body);
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
      await api("DELETE", `/api/services/${id}`);
      load();
    } catch (e) {
      alert("Xatolik: " + e.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Yuklanmoqda...</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Xizmatlar</h1>
        <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Qo'shish
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Hozircha xizmatlar yo'q</div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{s.name}</h3>
                  {s.category && <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{s.category}</span>}
                  {s.description && <p className="text-sm text-gray-500 mt-1">{s.description}</p>}
                  <p className="text-blue-600 font-bold mt-1">{Number(s.price).toLocaleString()} so'm</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-blue-600 text-sm">✏️</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 text-sm">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{editing ? "Tahrirlash" : "Yangi xizmat"}</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nomi *" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tavsifi" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-20 resize-none bg-gray-50 dark:bg-gray-700" />
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Narxi *" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700" />
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Kategoriya" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700" />
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Rasm URL (ixtiyoriy)" className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700" />
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
