'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface StoredOrder {
  id: string;
  date: string;
  items: Array<{
    productName: string;
    productEmoji: string;
    format: string;
    quantity: number;
    totalPrice: number;
  }>;
  total: number;
  status: 'en_cours' | 'expedie' | 'livre';
}

const STATUS_LABELS: Record<StoredOrder['status'], { label: string; color: string; bg: string }> = {
  en_cours: { label: 'En cours', color: '#D4A017', bg: '#FEF9E7' },
  expedie: { label: 'Expédié', color: '#0077B6', bg: '#E8F4FB' },
  livre: { label: 'Livré', color: '#43AA8B', bg: '#E6F4F0' },
};

type Tab = 'commandes' | 'profil' | 'connexion';

export default function ComptePage() {
  const [tab, setTab] = useState<Tab>('connexion');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('karibprint_user');
    if (stored) {
      const user = JSON.parse(stored);
      // Intentional sync from localStorage on mount (client-only session restore).
      /* eslint-disable react-hooks/set-state-in-effect */
      setIsLoggedIn(true);
      setUserName(user.name ?? user.email);
      setTab('commandes');
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    const storedOrders = localStorage.getItem('karibprint_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs.');
      return;
    }
    if (password.length < 6) {
      setLoginError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    const user = { email, name: email.split('@')[0] };
    localStorage.setItem('karibprint_user', JSON.stringify(user));
    setIsLoggedIn(true);
    setUserName(user.name);
    setTab('commandes');
    setLoginError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('karibprint_user');
    setIsLoggedIn(false);
    setUserName('');
    setEmail('');
    setPassword('');
    setTab('connexion');
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-sand min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Mon espace</h1>
              {isLoggedIn && (
                <p className="text-text-light mt-1">Bonjour, <span className="font-semibold text-ocean">{userName}</span> 👋</p>
              )}
            </div>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-sm text-text-light hover:text-coral transition-colors font-medium"
              >
                Se déconnecter
              </button>
            )}
          </div>

          {isLoggedIn ? (
            <>
              {/* Tabs */}
              <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm mb-8 w-fit">
                {([['commandes', '📦 Commandes'], ['profil', '👤 Profil']] as const).map(([t, label]) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      tab === t ? 'bg-ocean text-white shadow-sm' : 'text-text-light hover:text-text'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === 'commandes' && (
                <div>
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
                      <div className="text-6xl mb-6">📦</div>
                      <h2 className="text-xl font-bold mb-3">Aucune commande pour l&apos;instant</h2>
                      <p className="text-text-light mb-8">
                        Vos commandes apparaîtront ici une fois confirmées.
                      </p>
                      <Link
                        href="/produits"
                        className="inline-flex items-center gap-2 bg-coral text-white font-bold px-8 py-3.5 rounded-xl hover:bg-coral-dark transition-colors"
                      >
                        Commander →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const status = STATUS_LABELS[order.status];
                        return (
                          <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <p className="font-bold text-sm">Commande #{order.id}</p>
                                <p className="text-xs text-text-lighter mt-0.5">{order.date}</p>
                              </div>
                              <span
                                className="text-xs font-bold px-3 py-1 rounded-full"
                                style={{ color: status.color, background: status.bg }}
                              >
                                {status.label}
                              </span>
                            </div>
                            <div className="space-y-2 mb-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                  <span className="text-xl">{item.productEmoji}</span>
                                  <span className="flex-1">{item.productName} — {item.format} × {item.quantity.toLocaleString('fr-FR')}</span>
                                  <span className="font-semibold">{item.totalPrice.toFixed(2).replace('.', ',')} €</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                              <span className="text-xs text-text-lighter">Total TTC</span>
                              <span className="font-bold text-ocean">{order.total.toFixed(2).replace('.', ',')} €</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {tab === 'profil' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md">
                  <h2 className="font-bold text-lg mb-6">Informations personnelles</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Email</label>
                      <input
                        type="email"
                        defaultValue={email}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Nom d&apos;utilisateur</label>
                      <input
                        type="text"
                        defaultValue={userName}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Territoire préféré</label>
                      <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors">
                        <option>Guadeloupe</option>
                        <option>Martinique</option>
                        <option>Guyane</option>
                        <option>La Réunion</option>
                        <option>Saint-Martin</option>
                        <option>Saint-Barthélemy</option>
                      </select>
                    </div>
                    <button className="w-full bg-ocean text-white font-bold py-3 rounded-xl hover:bg-ocean-dark transition-colors text-sm">
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex gap-1 bg-sand rounded-xl p-1 mb-8">
                  <button
                    onClick={() => { setIsRegistering(false); setLoginError(''); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!isRegistering ? 'bg-white text-ocean shadow-sm' : 'text-text-light'}`}
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => { setIsRegistering(true); setLoginError(''); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isRegistering ? 'bg-white text-ocean shadow-sm' : 'text-text-light'}`}
                  >
                    Créer un compte
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {isRegistering && (
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Prénom / Société</label>
                      <input
                        type="text"
                        placeholder="Votre nom"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Adresse email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Mot de passe</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean transition-colors"
                      required
                    />
                  </div>

                  {loginError && (
                    <p className="text-sm text-coral font-medium">{loginError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-ocean text-white font-bold py-3.5 rounded-xl hover:bg-ocean-dark transition-colors text-sm shadow-md"
                  >
                    {isRegistering ? 'Créer mon compte →' : 'Se connecter →'}
                  </button>
                </form>

                {!isRegistering && (
                  <p className="text-center text-xs text-text-lighter mt-4">
                    <a href="#" className="text-ocean hover:underline">Mot de passe oublié ?</a>
                  </p>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs text-text-lighter mb-3">Ou continuer en tant qu&apos;invité</p>
                  <Link
                    href="/contact"
                    className="inline-block text-sm font-semibold text-ocean hover:underline"
                  >
                    Demander un devis sans compte →
                  </Link>
                </div>
              </div>

              <div className="mt-4 bg-ocean/5 rounded-2xl p-4 text-center">
                <p className="text-xs text-text-light">
                  <span className="font-semibold text-ocean">Avantages compte :</span> suivi de commandes, historique, devis sauvegardés, livraison pré-remplie.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
