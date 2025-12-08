import { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import { LoginContext } from '../contexts/LoginContext';

interface MenuProps {
  changerLangue: () => void;
}

export default function Menu({ changerLangue }: MenuProps) {
  const { isLoggedIn, logout, loading } = useContext(LoginContext);
  const navigate = useNavigate();
  const intl = useIntl();

  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      navigate('/login');
    }
  }, [isLoggedIn, loading]);

  const toggleMenu = () => setMenuOuvert(!menuOuvert);

  return (
    <>
      <header className="w-full bg-[#3b2f2f] text-[#f7f2e7] shadow-md p-4 flex justify-between items-center font-serif relative">
        {/* Titre */}
        <h1 className="text-xl sm:text-2xl font-bold">Chroniques du passé</h1>

        {/* Bouton hamburger pour mobile */}
        <button className="sm:hidden text-2xl" onClick={toggleMenu}>
          {menuOuvert ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menu desktop */}
        <nav className="hidden sm:flex space-x-6 items-center">
          <a href="/" className="hover:text-[#f0d9b5] transition">
            {intl.formatMessage({
              id: 'menu.accueil',
              defaultMessage: 'Accueil',
            })}
          </a>

          <a href="/histoire" className="hover:text-[#f0d9b5] transition">
            {intl.formatMessage({
              id: 'menu.histoire',
              defaultMessage: 'Histoire',
            })}
          </a>

          <button
            onClick={changerLangue}
            className="ml-4 text-xl hover:text-[#f0d9b5] transition flex items-center gap-1"
          >
            <FaGlobe />
          </button>

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

        {/* Menu mobile déroulant */}
        {menuOuvert && (
          <nav className="absolute top-16 left-0 w-full bg-[#4a3c3c] flex flex-col items-center py-5 sm:hidden gap-4 z-50">
            <a href="/" className="text-lg hover:text-[#f0d9b5] transition">
              {intl.formatMessage({
                id: 'menu.accueil',
                defaultMessage: 'Accueil',
              })}
            </a>

            <a
              href="/histoire"
              className="text-lg hover:text-[#f0d9b5] transition"
            >
              {intl.formatMessage({
                id: 'menu.histoire',
                defaultMessage: 'Histoire',
              })}
            </a>

            <button
              onClick={changerLangue}
              className="text-xl hover:text-[#f0d9b5] transition flex items-center gap-2"
            >
              <FaGlobe />
            </button>

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

      <Outlet />
    </>
  );
}
