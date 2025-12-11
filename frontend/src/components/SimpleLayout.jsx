import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

export default function SimpleLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user}
        onLogout={logout}
      />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
