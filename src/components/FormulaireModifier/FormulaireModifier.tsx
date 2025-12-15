import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContext';
import { useIntl } from 'react-intl';

// Le tailwindCSS est produit par ChatGPT

function FormulaireModifier() {
  // Récupère le token depuis le LoginContext
  const { token } = useContext(LoginContext);
  // Hook pour la navigation
  const navigate = useNavigate();
  // Récupération de l'id
  const { id } = useParams();
  // Hook pour l'intertionalisation
  const intl = useIntl();
  const API_URL = import.meta.env.VITE_API_URL;

  // État du formulaire
  const [nom, setNom] = useState('');
  const [pays, setPays] = useState('');
  const [naissance, setNaissance] = useState('');
  const [mort, setMort] = useState('');
  const [siecle, setSiecle] = useState<number | ''>('');
  const [role, setRole] = useState('');
  const [faitsMarquants, setFaitsMarquants] = useState<string[]>(['']);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          // Appel à l'API pour récupérer un personnage historique par son id
          `${API_URL}/api/histoire/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // Si réussi, il récupére les données reçues
        if (response.ok) {
          const data = await response.json();
          const h = data.histoire;
          setNom(h.nom);
          setPays(h.pays);
          setNaissance(h.naissance);
          setMort(h.mort || '');
          setSiecle(h.siecle);
          setRole(h.role);
          setFaitsMarquants(h.faitsMarquants.length ? h.faitsMarquants : ['']);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, token, navigate]);

  const handleFaitChange = (index: number, value: string) => {
    const nouveauxFaits = [...faitsMarquants];
    nouveauxFaits[index] = value;
    setFaitsMarquants(nouveauxFaits);
  };

  // Ajoute un nouveau champ de fait marquants
  const ajouterFait = () => setFaitsMarquants([...faitsMarquants, '']);
  // Supprime un fait marquant
  const supprimerFait = (index: number) =>
    setFaitsMarquants(faitsMarquants.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification de l'authentification
    if (!token) {
      setMessage(
        intl.formatMessage({
          id: 'formulaire.erreur.connexion.modifier',
        }),
      );
      return;
    }

    // Le personnage est vivant s'il y a une naissance mais pas de date de mort
    const vivant = naissance && !mort;

    // Corps de la requête envoyé à l'API
    const body = {
      histoire: {
        nom,
        pays,
        naissance,
        mort,
        vivant,
        siecle: Number(siecle),
        role,
        faitsMarquants: faitsMarquants.filter((f) => f.trim() !== ''),
      },
    };

    try {
      const response = await fetch(
        // Appel l'API pour modifier le personnage historique
        `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/modifier/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      if (response.ok) {
        navigate('/histoire');
      } else {
        setMessage(
          intl.formatMessage({
            id: 'formulaire.erreur.modification',
          }),
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        intl.formatMessage({
          id: 'formulaire.erreur.reseau.modifier',
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2e7] text-[#3b2f2f] flex flex-col items-center justify-start p-10 font-serif">
      <h1 className="text-4xl font-bold mb-6">
        {intl.formatMessage({ id: 'formulaire.titre.modifier' })}
      </h1>

      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        {/* Champs texte simples */}
        <input
          type="text"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.nom',
          })}
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />

        <input
          type="text"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.pays',
          })}
          value={pays}
          onChange={(e) => setPays(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Dates */}
        <label className="block mb-1 font-semibold">
          {intl.formatMessage({ id: 'formulaire.label.naissance' })}
        </label>
        <input
          type="date"
          value={naissance.slice(0, 10)}
          onChange={(e) => setNaissance(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />

        <label className="block mb-1 font-semibold">
          {intl.formatMessage({ id: 'formulaire.label.mort' })}
        </label>
        <input
          type="date"
          value={mort.slice(0, 10)}
          onChange={(e) => setMort(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Siècle */}
        <input
          type="number"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.siecle',
          })}
          value={siecle}
          onChange={(e) =>
            setSiecle(e.target.value ? Number(e.target.value) : '')
          }
          required
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Rôle */}
        <input
          type="text"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.role',
          })}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Faits marquants dynamiques */}
        <div className="mb-4">
          <h4 className="mb-2">
            {intl.formatMessage({ id: 'formulaire.titre.faits' })}
          </h4>

          {faitsMarquants.map((fait, index) => (
            <div key={index} className="flex gap-2 mb-1">
              <input
                type="text"
                placeholder={intl.formatMessage(
                  { id: 'formulaire.placeholder.fait' },
                  { numero: index + 1 },
                )}
                value={fait}
                onChange={(e) => handleFaitChange(index, e.target.value)}
                className="flex-1 p-2 border rounded"
              />

              <button
                type="button"
                onClick={() => supprimerFait(index)}
                className="px-2 bg-red-500 text-white rounded"
              >
                {intl.formatMessage({ id: 'formulaire.bouton.supprimer' })}
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={ajouterFait}
            className="px-4 py-1 bg-gray-700 text-white rounded mt-1"
          >
            {intl.formatMessage({ id: 'formulaire.bouton.ajouter.fait' })}
          </button>
        </div>

        {/* Bouton de validation */}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
        >
          {intl.formatMessage({ id: 'formulaire.bouton.modifier' })}
        </button>

        {/* Message d’erreur */}
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default FormulaireModifier;
