import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/nav/Navbar';
import api, { RegisterData } from '../lib/api';

type RoleType = 'PATIENT' | 'MEDECIN' | 'CHERCHEUR' | 'ADMIN_TENANT' | null;

export default function SignUpPage() {
  const [role, setRole] = useState<RoleType>(null);
  const [tenantId, setTenantId] = useState('chu-casablanca');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [lab, setLab] = useState('');
  const [codeInpe, setCodeInpe] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const roleLabels: Record<string, string> = {
    PATIENT: 'Patient',
    MEDECIN: 'Médecin',
    CHERCHEUR: 'Chercheur',
    ADMIN_TENANT: 'Administrateur d\'établissement',
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      if (!role) {
        setMessage('Veuillez choisir un rôle');
        setLoading(false);
        return;
      }

      // Mapper le rôle vers les valeurs attendues par le backend
      const mappedRole: RegisterData['role'] =
        role === 'PATIENT'
          ? 'patient'
          : role === 'MEDECIN'
          ? 'medecin'
          : role === 'CHERCHEUR'
          ? 'chercheur'
          : 'admin';

      // Générer un username simple à partir de l'email
      const username = email.split('@')[0] || email;

      const registerData: RegisterData = {
        username,
        email,
        password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
        role: mappedRole,
        tenant_id: tenantId,
      };

      if (mappedRole === 'patient' && birthDate) {
        registerData.date_naissance = birthDate;
      }

      if (mappedRole === 'medecin') {
        if (speciality) registerData.specialite = speciality;
        if (codeInpe) registerData.inpe = codeInpe;
      }

      if (mappedRole === 'chercheur') {
        if (lab) registerData.institution = lab;
      }

      // Appel via le service API centralisé
      await api.register(registerData);

      setMessage('Compte créé avec succès ! Redirection vers la page de connexion...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setMessage(err?.message || 'Erreur réseau');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Inscription - Abhar Santé Maroc</title>
      </Head>
      <Navbar />
      <div className="relative min-h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/vid_background.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="card-transparent w-full max-w-lg">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Créer un compte</h1>

            {!role && (
              <div className="grid gap-4">
                <p className="text-sm text-gray-700 mb-2">Choisissez votre rôle :</p>
                {(['PATIENT', 'MEDECIN', 'CHERCHEUR', 'ADMIN_TENANT'] as RoleType[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className="p-4 border-2 border-brand/30 rounded-lg hover:border-brand hover:bg-brand-50 transition-all text-left group"
                  >
                    <div className="font-semibold text-gray-800 group-hover:text-brand-700 text-lg">
                      {roleLabels[r!]}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {r === 'PATIENT' && 'Accédez à vos dossiers médicaux et résultats d\'analyses'}
                      {r === 'MEDECIN' && 'Gérez vos patients et utilisez les modèles d\'IA'}
                      {r === 'CHERCHEUR' && 'Analysez les données et contribuez à la recherche'}
                      {r === 'ADMIN_TENANT' && 'Administrez votre établissement de santé'}
                    </div>
                  </button>
                ))}
                <Link href="/login" className="text-sm text-center text-brand-600 hover:text-brand-700 mt-4">
                  Déjà un compte ? Se connecter
                </Link>
              </div>
            )}

            {role && (
              <form onSubmit={onSubmit} className="grid gap-3">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-300">
                  <div>
                    <span className="text-sm text-gray-600">Rôle sélectionné :</span>
                    <span className="ml-2 font-semibold text-brand-700">{roleLabels[role]}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRole(null)}
                    className="text-sm text-gray-600 hover:text-brand-700 underline"
                  >
                    Changer
                  </button>
                </div>

                <label className="grid gap-1">
                  <span className="text-sm text-gray-700 font-medium">Établissement (tenant)</span>
                  <input
                    className="input"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    placeholder="chu-casablanca"
                    required
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm text-gray-700 font-medium">Email</span>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    required
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm text-gray-700 font-medium">Mot de passe</span>
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </label>

                {role !== 'ADMIN_TENANT' && (
                  <>
                    <label className="grid gap-1">
                      <span className="text-sm text-gray-700 font-medium">Prénom</span>
                      <input
                        className="input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Prénom"
                        required
                      />
                    </label>

                    <label className="grid gap-1">
                      <span className="text-sm text-gray-700 font-medium">Nom</span>
                      <input
                        className="input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nom"
                        required
                      />
                    </label>
                  </>
                )}

                {role === 'PATIENT' && (
                  <label className="grid gap-1">
                    <span className="text-sm text-gray-700 font-medium">Date de naissance (optionnel)</span>
                    <input
                      className="input"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </label>
                )}

                {role === 'MEDECIN' && (
                  <>
                    <label className="grid gap-1">
                      <span className="text-sm text-gray-700 font-medium">Code INPE <span className="text-red-600">*</span></span>
                      <input
                        className="input"
                        value={codeInpe}
                        onChange={(e) => setCodeInpe(e.target.value)}
                        placeholder="Ex: INPE-MED-12345"
                        required
                      />
                      <span className="text-xs text-gray-500">
                        Code d'identification national du professionnel de santé
                      </span>
                    </label>
                    <label className="grid gap-1">
                      <span className="text-sm text-gray-700 font-medium">Spécialité (optionnel)</span>
                      <input
                        className="input"
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        placeholder="Cardiologie, Neurologie..."
                      />
                    </label>
                  </>
                )}

                {role === 'CHERCHEUR' && (
                  <label className="grid gap-1">
                    <span className="text-sm text-gray-700 font-medium">Laboratoire (optionnel)</span>
                    <input
                      className="input"
                      value={lab}
                      onChange={(e) => setLab(e.target.value)}
                      placeholder="Nom du laboratoire"
                    />
                  </label>
                )}

                {role === 'ADMIN_TENANT' && (
                  <label className="grid gap-1">
                    <span className="text-sm text-gray-700 font-medium">Code INPE Établissement <span className="text-red-600">*</span></span>
                    <input
                      className="input"
                      value={codeInpe}
                      onChange={(e) => setCodeInpe(e.target.value)}
                      placeholder="Ex: INPE-ADM-67890"
                      required
                    />
                    <span className="text-xs text-gray-500">
                      Code d'identification national de l'établissement de santé
                    </span>
                  </label>
                )}

                <button className="btn mt-2" type="submit" disabled={loading}>
                  {loading ? 'Création en cours...' : 'Créer mon compte'}
                </button>
              </form>
            )}

            {message && (
              <p className={`mt-4 text-sm ${message.includes('succès') ? 'text-green-700' : 'text-red-700'}`}>
                {message}
              </p>
            )}

            {role && (
              <Link href="/login" className="block text-sm text-center text-brand-600 hover:text-brand-700 mt-4">
                Déjà un compte ? Se connecter
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

