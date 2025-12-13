import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import { LoginContext } from '../contexts/LoginContext';

// Le tailwindCSS est produit par ChatGPT

interface MenuProps {
  changerLangue: () => void;
}

export default function Menu({ changerLangue }: MenuProps) {
  // Récupération du statut de connexion depuis le LoginContext
  const { isLoggedIn, logout, loading } = useContext(LoginContext);
  // Hook permettant de naviaguer entre les pages
  const navigate = useNavigate();
  // Hook pour la traduction
  const intl = useIntl();

  // État qui gère le menu lorsque l'écran se rétricit
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Redirige l'utilisateur vers la page login s'il n'est pas connecté
  useEffect(() => {
    if (!isLoggedIn && !loading) {
      navigate('/login');
    }
  }, [isLoggedIn, loading]);

  // Permet de ouvrir/fermer le menu sur les petits écrans
  const toggleMenu = () => setMenuOuvert(!menuOuvert);

  return (
    <>
      {/* En-tête */}
      <header className="w-full bg-[#3b2f2f] text-[#f7f2e7] shadow-md p-4 flex justify-between items-center font-serif relative">
        {/* Titre */}
        <h1 className="text-xl sm:text-2xl font-bold">Chroniques du passé</h1>

        {/* Bouton hamburger pour les écrans plus petits */}
        <button className="sm:hidden text-2xl" onClick={toggleMenu}>
          {menuOuvert ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menu sur écran normal */}
        <nav className="hidden sm:flex space-x-6 items-center">
          {/* Lien Accueil */}
          <a href="/" className="hover:text-[#f0d9b5] transition">
            {intl.formatMessage({
              id: 'menu.accueil',
              defaultMessage: 'Accueil',
            })}
          </a>

          {/* Lien Histoire */}
          <a href="/histoire" className="hover:text-[#f0d9b5] transition">
            {intl.formatMessage({
              id: 'menu.histoire',
              defaultMessage: 'Histoire',
            })}
          </a>

          {/* Bouton pour changer la langue */}
          <button
            onClick={changerLangue}
            className="ml-4 text-xl hover:text-[#f0d9b5] transition flex items-center gap-1"
          >
            <FaGlobe />
          </button>

          {/* Bouton déconnexion */}
          <button
            className="ml-4 text-[#f7f2e7] hover:text-[#f0d9b5] transition"
            onClick={logout}
          >
            {intl.formatMessage({
              id: 'menu.deconnexion',
              defaultMessage: 'Se déconnecter',
            })}
          </button>
        </nav>

        {/* Menu version mobile */}
        {menuOuvert && (
          <nav className="absolute top-16 left-0 w-full bg-[#4a3c3c] flex flex-col items-center py-5 sm:hidden gap-4 z-50">
            {/* Lien Accueil */}
            <a href="/" className="text-lg hover:text-[#f0d9b5] transition">
              {intl.formatMessage({
                id: 'menu.accueil',
                defaultMessage: 'Accueil',
              })}
            </a>

            {/* Lien Histoire */}
            <a
              href="/histoire"
              className="text-lg hover:text-[#f0d9b5] transition"
            >
              {intl.formatMessage({
                id: 'menu.histoire',
                defaultMessage: 'Histoire',
              })}
            </a>

            {/* Bouton changement de langue */}
            <button
              onClick={changerLangue}
              className="text-xl hover:text-[#f0d9b5] transition flex items-center gap-2"
            >
              <FaGlobe />
            </button>

            {/* Bouton déconnexion */}
            <button
              className="text-lg hover:text-[#f0d9b5] transition"
              onClick={logout}
            >
              {intl.formatMessage({
                id: 'menu.deconnexion',
                defaultMessage: 'Se déconnecter',
              })}
            </button>
          </nav>
        )}
      </header>

      {/* Affiche le contenue de la page sélectionné */}
      <Outlet />
    </>
  );
}
