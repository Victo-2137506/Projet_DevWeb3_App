import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

// Le code est inspiré des notes de cours : https://web3.profinfo.ca/authentification/#authentification

export type LoginContextType = {
  isLoggedIn: boolean;
  token: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const LoginContext = createContext<LoginContextType>({
  isLoggedIn: false,
  token: '',
  loading: true,
  login: () => new Promise<boolean>(() => false),
  logout: () => {},
});

export default function LoginProvider(props: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Token récupérer dans le localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    return axios
      .post(`${API_URL}/api/generatetoken`, {
        userLogin: {
          email,
          password,
        },
      })
      .then((response) => {
        const { token } = response.data;
        console.log(token);
        if (token) {
          // Sauvegarde du token pour conserver la session
          localStorage.setItem('token', token);
          setIsLoggedIn(true);
          setToken(token);
          return true;
        } else {
          setIsLoggedIn(false);
          setToken('');
          return false;
        }
      });
  }

  function logout() {
    setToken('');
    setIsLoggedIn(false);
    // Supprime le token lors de la déconnexion
    localStorage.removeItem('token');
  }

  const values = { isLoggedIn, token, loading, login, logout };

  return (
    <LoginContext.Provider value={values}>
      {props.children}
    </LoginContext.Provider>
  );
}
