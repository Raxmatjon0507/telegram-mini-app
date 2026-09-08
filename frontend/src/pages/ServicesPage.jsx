import { useState, useEffect } from "react";
import { api } from "../api";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderModal, setOrderModal] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    api("GET", "/api/services")
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleOrder = async (service) => {
    setOrdering(true);
    try {
      await api("POST", `/api/services/${service.id}/order`);
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderModal(null);
        setOrderSuccess(false);
      }, 2000);
    } catch (e) {
      alert("Buyurtma berishda xatolik: " + e.message);
    }
    setOrdering(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Xizmatlar</h1>
      {services.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Hozircha xizmatlar yo'q</div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              {s.image_url && (
                <img
                  src={s.image_url}
                  alt={s.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="font-bold text-lg">{s.name}</h3>
              {s.category && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {s.category}
                </span>
              )}
              {s.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{s.description}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {Number(s.price).toLocaleString()} so'm
                </span>
                <button
                  onClick={() => {
                    setOrderModal(s);
                    setOrderSuccess(false);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sotib olish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {orderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            {orderSuccess ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <div className="text-lg font-bold text-green-600">Buyurtma qabul qilindi!</div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2">Buyurtma tasdiqlash</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">{orderModal.name}</p>
                <p className="text-blue-600 font-bold text-lg mb-4">
                  {Number(orderModal.price).toLocaleString()} so'm
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrderModal(null)}
                    className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-600"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={() => handleOrder(orderModal)}
                    disabled={ordering}
                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    {ordering ? "Yuborilmoqda..." : "Tasdiqlash"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
