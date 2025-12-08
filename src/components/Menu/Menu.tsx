import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { FaGlobe } from 'react-icons/fa';
import { LoginContext } from '../contexts/LoginContext';

interface MenuProps {
  changerLangue: () => void;
}

export default function Menu({ changerLangue }: MenuProps) {
  const { isLoggedIn, logout, loading } = useContext(LoginContext);
  const navigate = useNavigate();
  const intl = useIntl();

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      navigate('/login');
    }
  }, [isLoggedIn, loading]);

  return (
    <>
      <header className="w-full bg-[#5c3d2e] text-[#f7f2e7] shadow-md p-4 flex justify-between items-center font-serif">
        <h1 className="text-2xl font-bold">Chroniques du passé</h1>
        <nav className="space-x-6 flex items-center">
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
            onClick={() => logout()}
          >
            {intl.formatMessage({
              id: 'menu.deconnexion',
              defaultMessage: 'Se déconnecter',
            })}
          </button>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
