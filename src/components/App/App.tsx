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

// L'internationalisation est insipiré des notes de cours : https://web3.profinfo.ca/internationalisation/
// Le localStorage est inspiré de mon projet de technologie émergente

function App() {
  // Récupère la langue sauvegardée dans le local storage
  const storeLangue = localStorage.getItem('locale') || 'fr';
  // État représentant la langue actuelle
  const [locale, setLocale] = useState(storeLangue);
  // État contenant tous les messages traduits selon la langue
  const [messages, setMessages] = useState(
    storeLangue === 'fr' ? Francais : Anglais,
  );

  // Permet de changer la langue du site
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

  // Toutes les routes du site sont définies ci-dessous
  return (
    // Fournit les informations de connexion à l'ensemble de l'application
    <LoginProvider>
      {/* Fournit la traduction selon la langue sélectionnée */}
      <IntlProvider locale={locale} messages={messages}>
        {/* Router principal permettant d'utiliser les routes */}
        <BrowserRouter>
          <Routes>
            {/* Page de connexion */}
            <Route path="/login" element={<Login />} />

            {/* Menu affiché sur toutes les pages sauf login */}
            <Route element={<Menu changerLangue={changerLangue} />}>
              {/* Accueil */}
              <Route path="/" element={<Accueil />} />

              {/* Liste des personnages historiques */}
              <Route path="/histoire" element={<Histoire />} />

              {/* Détails d'une personne historique selon l'ID */}
              <Route path="/histoire/:id" element={<DetailsHistoire />} />

              {/* Ajouter une nouvelle personne historique */}
              <Route path="/histoire/ajouter" element={<Formualaire />} />

              {/* Modifier une personne historique existante */}
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
