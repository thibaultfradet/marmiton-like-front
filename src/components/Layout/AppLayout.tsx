import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-2 sm:px-6 py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
