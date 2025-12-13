import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={logout}
      />
      <div className="flex flex-1 pt-16">
        <Sidebar 
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          userRole={user?.role}
        />
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
