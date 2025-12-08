import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import axios from 'axios';
import { LoginContext } from '../contexts/LoginContext';

interface IHistoire {
  _id: string;
  nom: string;
}

function Histoire() {
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();
  const intl = useIntl();

  const [personnages, setPersonnages] = useState<IHistoire[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres à conserver
  const [pays, setPays] = useState('');
  const [siecle, setSiecle] = useState('');

  const fetchHistoires = () => {
    setLoading(true);

    // AUCUN filtre → route /all
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

    // Route filtrée
    const url = `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/filtre?pays=${pays}&siecle=${siecle}`;

    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setPersonnages(res.data.histoires || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Charger au début
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchHistoires();
  }, [token]);

  // Recharger quand un filtre change
  useEffect(() => {
    if (token) fetchHistoires();
  }, [pays, siecle]);

  return (
    <div className="min-h-screen bg-[#f7f2e7] text-[#3b2f2f] flex flex-col items-center p-10 font-serif">
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

      {/* Filtres */}
      <div className="w-full max-w-3xl flex flex-col gap-4 mb-8">
        <div className="flex gap-4">
          {/* Filtre pays */}
          <input
            type="text"
            placeholder="Pays"
            value={pays}
            onChange={(e) => setPays(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
          />

          {/* Filtre siècle */}
          <input
            type="number"
            placeholder="Siècle (ex: 18)"
            value={siecle}
            onChange={(e) => setSiecle(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
          />
        </div>
      </div>

      {/* Bouton Ajouter */}
      {token && (
        <button
          onClick={() => navigate('/histoire/ajouter')}
          className="mb-6 px-6 py-2 bg-[#5c3d2e] text-white rounded-xl hover:bg-[#5a4747] transition-colors"
        >
          Ajouter une personne historique
        </button>
      )}

      {/* Liste */}
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
