//Le tailwindCSS est générer par ChatGPT

import { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { LoginContext } from '../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();
  const { login, isLoggedIn } = useContext(LoginContext);
  const intl = useIntl();

  async function performLogin() {
    try {
      const reussi = await login(email, password);
      if (!reussi) {
        setErreur(
          intl.formatMessage({
            id: 'login.erreur.identifiants',
            defaultMessage: 'Identifiants incorrects',
          }),
        );
      } else {
        setErreur('');
      }
    } catch {
      setErreur(
        intl.formatMessage({
          id: 'login.erreur.connexion',
          defaultMessage: 'Erreur de connexion',
        }),
      );
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="bg-[#f5f0e6] flex items-center justify-center h-screen font-serif">
      <div className="bg-[#fffaf3] border border-[#d8cbb3] rounded-xl shadow-md p-10 w-full max-w-md">
        <h1 className="text-3xl text-[#5c3d2e] font-bold mb-6 text-center">
          {intl.formatMessage({
            id: 'login.titre',
            defaultMessage: 'Connexion',
          })}
        </h1>
        <p className="text-[#7a6a58] text-center mb-8">
          {intl.formatMessage({
            id: 'login.description',
            defaultMessage: 'Accédez aux chroniques du passé',
          })}
        </p>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              htmlFor="email"
              className="block text-[#5c3d2e] mb-2 text-sm"
            >
              {intl.formatMessage({
                id: 'login.label.email',
                defaultMessage: 'Adresse e-mail',
              })}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#d8cbb3] rounded-md bg-[#fffaf3] text-[#5c3d2e] focus:outline-none focus:ring-2 focus:ring-[#b89b72]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[#5c3d2e] mb-2 text-sm"
            >
              {intl.formatMessage({
                id: 'login.label.password',
                defaultMessage: 'Mot de passe',
              })}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#d8cbb3] rounded-md bg-[#fffaf3] text-[#5c3d2e] focus:outline-none focus:ring-2 focus:ring-[#b89b72]"
            />
          </div>

          {erreur && (
            <p className="text-red-600 text-sm text-center">{erreur}</p>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={performLogin}
              className="bg-[#5c3d2e] hover:bg-[#7a543c] text-white font-semibold py-2 px-6 rounded-md transition duration-300"
            >
              {intl.formatMessage({
                id: 'login.bouton.connecter',
                defaultMessage: 'Se connecter',
              })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
