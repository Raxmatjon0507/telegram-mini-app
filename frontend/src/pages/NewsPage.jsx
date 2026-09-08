import { useState, useEffect } from "react";
import { api } from "../api";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("GET", "/api/news")
      .then(setNews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Yangiliklar</h1>
      {news.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Hozircha yangiliklar yo'q</div>
      ) : (
        <div className="space-y-3">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">
                {item.content}
              </p>
              <div className="text-xs text-gray-400 mt-3">
                {new Date(item.created_at).toLocaleDateString("uz-UZ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
