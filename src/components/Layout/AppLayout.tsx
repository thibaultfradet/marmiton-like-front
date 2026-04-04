import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-2 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
