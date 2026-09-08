import { NavLink, Outlet } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

export default function UserLayout() {
  const navItems = [
    { to: "/", label: "Xizmatlar", icon: "🏠" },
    { to: "/news", label: "Yangiliklar", icon: "📰" },
    { to: "/settings", label: "Sozlamalar", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </div>
      <FloatingButton />
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
