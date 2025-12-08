import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

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

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    return axios
      .post(
        'https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/generatetoken',
        {
          userLogin: {
            email,
            password,
          },
        },
      )
      .then((response) => {
        const { token } = response.data;
        console.log(token);
        if (token) {
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
    localStorage.removeItem('token');
  }

  const values = { isLoggedIn, token, loading, login, logout };

  return (
    <LoginContext.Provider value={values}>
      {props.children}
    </LoginContext.Provider>
  );
}
