import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const navItems = [
    { to: "/", label: "Boshqaruv", icon: "📊" },
    { to: "/services", label: "Xizmatlar", icon: "🛠" },
    { to: "/news", label: "Yangiliklar", icon: "📰" },
    { to: "/orders", label: "Buyurtmalar", icon: "📋" },
    { to: "/complaints", label: "Shikoyatlar", icon: "⚠️" },
    { to: "/settings", label: "Sozlamalar", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-600 text-white p-3 text-center font-bold text-lg">
        Admin Panel
      </div>
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex justify-around py-2 flex-wrap">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors text-center ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
