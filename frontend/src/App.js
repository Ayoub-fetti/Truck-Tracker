import { useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={logout}
      />
      <div className="flex flex-1 pt-16">
        {isAdminPage && (
          <Sidebar 
            isOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
            userRole={user?.role}
          />
        )}
        <main className={`flex-1 ${isAdminPage ? 'lg:ml-64' : ''}`}>
          <AppRoutes />
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
