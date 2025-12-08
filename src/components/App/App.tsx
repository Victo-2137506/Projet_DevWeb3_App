import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { useState } from 'react';
import LoginProvider from '../contexts/LoginContext';
import Accueil from '../Accueil/Accueil';
import Histoire from '../Histoire/Histoire';
import Login from '../Login/Login';
import Menu from '../Menu/Menu';
import Formualaire from '../Formulaire';
import FormulaireModifier from '../FormulaireModifier';
import DetailsHistoire from '../DetailsHistoire/DetailsHistoire';
import Francais from '../lang/fr.json';
import Anglais from '../lang/en.json';

function App() {
  const storeLangue = localStorage.getItem('locale') || 'fr';
  const [locale, setLocale] = useState(storeLangue);
  const [messages, setMessages] = useState(
    storeLangue === 'fr' ? Francais : Anglais,
  );

  const changerLangue = () => {
    if (locale === 'fr') {
      setLocale('en');
      setMessages(Anglais);
      localStorage.setItem('locale', 'en');
    } else {
      setLocale('fr');
      setMessages(Francais);
      localStorage.setItem('locale', 'fr');
    }
  };

  return (
    <LoginProvider>
      <IntlProvider locale={locale} messages={messages}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Menu changerLangue={changerLangue} />}>
              <Route path="/" element={<Accueil />} />
              <Route path="/histoire" element={<Histoire />} />
              <Route path="/histoire/:id" element={<DetailsHistoire />} />
              <Route path="/histoire/ajouter" element={<Formualaire />} />
              <Route
                path="/histoire/modifier/:id"
                element={<FormulaireModifier />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </IntlProvider>
    </LoginProvider>
  );
}

export default App;
