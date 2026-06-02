import Navbar from '../nav/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="container py-6">{children}</div>
    </div>
  );
}
