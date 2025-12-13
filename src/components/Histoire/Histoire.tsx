import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import axios from 'axios';
import { LoginContext } from '../contexts/LoginContext';
// Code inspiré des notes de cours et de l'exercice 11 : https://web3.profinfo.ca/react4/à
// Pour la gestion du token, le code est inspiré des notes de cours : https://web3.profinfo.ca/authentification/
// Le tailwindCSS est produit par ChatGPT

// Interface représentant une personne historique
// Affiche seulement son id et son nom
interface IHistoire {
  _id: string;
  nom: string;
}

function Histoire() {
  // Récupère le token depuis le LoginContext
  const { token } = useContext(LoginContext);
  // Hook de navigation
  const navigate = useNavigate();
  // Hook pour la traduction
  const intl = useIntl();

  // Stocker la liste des personnages renvoyés par l'API
  const [personnages, setPersonnages] = useState<IHistoire[]>([]);
  // Pour afficher "Chargement..." pendant la recherche
  const [loading, setLoading] = useState(true);

  // Filtre de recherche
  const [pays, setPays] = useState('');
  const [siecle, setSiecle] = useState('');

  // Récupère les personnages historiques depuis l'API
  const fetchHistoires = () => {
    setLoading(true);

    // Si aucun filtre n'est appliqué, récupere tout les personnages
    if (!pays && !siecle) {
      return axios
        .get(
          'https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/all',
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((res) => {
          setPersonnages(res.data.histoires);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    // Sinon récupere les personnages historiques filtrées
    const url = `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/filtre?pays=${pays}&siecle=${siecle}`;

    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        // Si pas de résultat, on met un tableau vide
        setPersonnages(res.data.histoires || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Si pas de token on ne charge rien, sinon on récupère les personnages historiques
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchHistoires();
  }, [token]);

  // On relance la recherche à chaque fois que les filtres change
  useEffect(() => {
    if (token) fetchHistoires();
  }, [pays, siecle]);

  return (
    <div className="min-h-screen bg-[#f7f2e7] text-[#3b2f2f] font-serif p-5 md:p-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-6 tracking-widest drop-shadow-md">
        {intl.formatMessage({
          id: 'histoire.titre',
          defaultMessage: 'Histoires du passé',
        })}
      </h1>

      <p className="text-xl max-w-2xl text-center mb-6">
        {intl.formatMessage({
          id: 'histoire.description',
          defaultMessage:
            'Ici, tu pourras découvrir les personnages historiques que tu souhaites explorer.',
        })}
      </p>

      <div className="w-full max-w-3xl flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder={intl.formatMessage({
              id: 'histoire.pays',
              defaultMessage: 'Pays',
            })}
            value={pays}
            onChange={(e) => setPays(e.target.value)}
            className="flex-1 p-3 rounded-lg border shadow-sm bg-[#faf5eb] focus:ring focus:ring-[#c7b299]"
          />
          <input
            type="number"
            placeholder={intl.formatMessage({
              id: 'histoire.siecle',
              defaultMessage: 'Siècle',
            })}
            value={siecle}
            onChange={(e) => setSiecle(e.target.value)}
            className="flex-1 p-3 rounded-lg border shadow-sm bg-[#faf5eb] focus:ring focus:ring-[#c7b299]"
          />
        </div>
      </div>

      {token && (
        <button
          onClick={() => navigate('/histoire/ajouter')}
          className="mb-6 px-6 py-2 bg-[#3b2f2f] text-white rounded-xl hover:bg-[#5a4747] transition-colors"
        >
          {intl.formatMessage({
            id: 'histoire.ajouterPersonne',
            defaultMessage: 'Ajouter une personne historique',
          })}
        </button>
      )}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {personnages.map((p) => (
            <div
              key={p._id}
              className="bg-white p-4 rounded-xl shadow-md flex justify-center items-center cursor-pointer hover:bg-gray-100"
              onClick={() => navigate(`/histoire/${p._id}`)}
            >
              <h2 className="text-2xl font-semibold">{p.nom}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Histoire;
