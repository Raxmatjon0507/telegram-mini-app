import { useTheme } from "../../context/ThemeContext";

export default function AdminSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sozlamalar</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold mb-3">Mavzu</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
              theme === "light"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                : "border-gray-200 dark:border-gray-600"
            }`}
          >
            ☀️ Kunduzgi
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
              theme === "dark"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                : "border-gray-200 dark:border-gray-600"
            }`}
          >
            🌙 Tungi
          </button>
        </div>
      </div>
    </div>
  );
}
