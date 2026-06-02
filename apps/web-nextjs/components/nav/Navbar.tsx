import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  return (
    <header className="bg-white border-b">
      <div className="container h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo-abhar.png" alt="Abhar" width={40} height={40} className="rounded-lg" />
          <Link href="/" className="font-semibold text-gray-800 hover:text-brand transition-colors">Abhar Santé Maroc</Link>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.first_name} {user?.last_name}</span>
              <Link className="btn h-9" href="/profile">Profil</Link>
            </>
          ) : (
            <Link className="btn h-9" href="/login">Se connecter</Link>
          )}
        </div>
      </div>
    </header>
  );
}
