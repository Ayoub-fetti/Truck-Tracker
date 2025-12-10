import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar, userRole }) => {
  const adminMenuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/admin/trucks', name: 'Trucks', icon: '🚛' },
    { path: '/admin/trailers', name: 'Trailers', icon: '🚚' },
    { path: '/admin/trips', name: 'Trips', icon: '🗺️' },
    { path: '/admin/maintenance', name: 'Maintenance', icon: '🔧' },
    { path: '/admin/tires', name: 'Tires', icon: '⚙️' },
  ];

  const driverMenuItems = [
    { path: '/driver/my-trips', name: 'My Trips', icon: '🗺️' },
    { path: '/driver/fuel-logs', name: 'Fuel Logs', icon: '⛽' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : driverMenuItems;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 lg:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={closeSidebar} className="p-2 rounded-md hover:bg-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 lg:mt-16">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
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
