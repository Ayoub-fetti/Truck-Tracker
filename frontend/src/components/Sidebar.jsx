import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, closeSidebar, userRole }) => {
  const adminMenuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <i class="fa-solid fa-tablet-screen-button"></i> },
    { path: "/admin/trucks", name: "Trucks", icon: <i class="fa-solid fa-truck"></i> },
    { path: "/admin/trailers", name: "Trailers", icon: <i class="fa-solid fa-trailer"></i> },
    { path: "/admin/trips", name: "Trips", icon: <i class="fa-solid fa-map"></i> },
    { path: "/admin/maintenance", name: "Maintenance", icon: <i class="fa-solid fa-gears"></i> },
    { path: "/admin/tires", name: "Tires", icon: <i class="fa-solid fa-circle-notch"></i> },
    { path: "/admin/fuel", name: "Fuel", icon: <i class="fa-solid fa-gas-pump"></i> },
    { path: "/admin/users", name: "Users", icon: <i class="fa-solid fa-users"></i> },
  ];

  const driverMenuItems = [
    { path: "/driver/my-trips", name: "My Trips", icon: "🗺️" },
    { path: "/driver/fuel-logs", name: "Fuel Logs", icon: "⛽" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : driverMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-18 left-0 z-50 w-64 h-[calc(100vh-4rem)] 
        bg-gray-900/95 text-white shadow-xl backdrop-blur 
        transform transition-transform duration-300 ease-in-out 
        overflow-y-auto lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 lg:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md hover:bg-gray-800/70 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul className="space-y-1.5 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `
                    group flex items-center gap-3 px-4 py-2.5 rounded-xl 
                    transition-all duration-200 
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-800/70 hover:text-white"
                    }
                  `
                  }
                >
                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
