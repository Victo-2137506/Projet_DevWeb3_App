import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { LoginContext } from '../contexts/LoginContext';

// Le tailwindCSS est produit par ChatGPT
// Pour la gestion du token, le code est inspiré des notes de cours : https://web3.profinfo.ca/authentification/

function FormulaireAjout() {
  // Récupère le token d'authentification depuis le LoginContext
  const { token } = useContext(LoginContext);
  // Hook pour la navigation
  const navigate = useNavigate();
  // Hook pour la traduction
  const intl = useIntl();

  // États pour stocker les champs du formulaire
  const [nom, setNom] = useState('');
  const [pays, setPays] = useState('');
  const [naissance, setNaissance] = useState('');
  const [mort, setMort] = useState('');
  const [siecle, setSiecle] = useState<number | ''>('');
  const [role, setRole] = useState('');
  const [faitsMarquants, setFaitsMarquants] = useState<string[]>(['']);
  const [message, setMessage] = useState('');

  // Met à jour un fait marquant à un index (Inspiré de Claude IA)
  const handleFaitChange = (index: number, value: string) => {
    const nouveauxFaits = [...faitsMarquants];
    nouveauxFaits[index] = value;
    setFaitsMarquants(nouveauxFaits);
  };

  // Ajoute un champ de fait supplémentaire (Inspiré de Claude IA)
  const ajouterFait = () => setFaitsMarquants([...faitsMarquants, '']);
  // Supprime un champ de fait selon l'index
  const supprimerFait = (index: number) =>
    setFaitsMarquants(faitsMarquants.filter((_, i) => i !== index));

  // Gestion de l'envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifie si l'utilisateur est connecté
    if (!token) {
      setMessage(
        intl.formatMessage({
          id: 'formulaire.erreur.connexion.ajout',
          defaultMessage:
            'Vous devez être connecté pour ajouter une personne historique.',
        }),
      );
      return;
    }

    // Détermination implicite de vivant
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
      // Requête POST vers l'API pour ajouter une personne historique
      const response = await fetch(
        `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/ajouter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      // Si la requête a fontionné, retour à la liste des personnages historiques
      if (response.ok) {
        navigate('/histoire');
      } else {
        // Sinon message d'erreur
        setMessage(
          intl.formatMessage({
            id: 'formulaire.erreur.ajout',
            defaultMessage: "Erreur lors de l'ajout de l'histoire.",
          }),
        );
      }
    } catch (error) {
      // En cas erreur réseau
      console.error(error);
      setMessage(
        intl.formatMessage({
          id: 'formulaire.erreur.reseau.ajout',
          defaultMessage: "Erreur réseau, impossible d'ajouter l'histoire.",
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2e7] text-[#3b2f2f] flex flex-col items-center justify-start p-10 font-serif">
      {/* Titre de la page */}
      <h1 className="text-4xl font-bold mb-6">
        {intl.formatMessage({
          id: 'formulaire.titre.ajout',
          defaultMessage: 'Ajouter une personne historique',
        })}
      </h1>

      {/* Formulaire */}
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        {/* Champ : nom */}
        <input
          type="text"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.nom',
            defaultMessage: 'Nom',
          })}
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Champ : pays */}
        <input
          type="text"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.pays',
            defaultMessage: 'Pays',
          })}
          value={pays}
          onChange={(e) => setPays(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Date de naissance */}
        <label className="block mb-1 font-semibold">
          {intl.formatMessage({
            id: 'formulaire.label.naissance',
            defaultMessage: 'Date de naissance',
          })}
        </label>
        <input
          type="date"
          value={naissance}
          onChange={(e) => setNaissance(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Date de mort */}
        <label className="block mb-1 font-semibold">
          {intl.formatMessage({
            id: 'formulaire.label.mort',
            defaultMessage: 'Date de mort',
          })}
        </label>
        <input
          type="date"
          value={mort}
          onChange={(e) => setMort(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Siècle */}
        <input
          type="number"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.siecle',
            defaultMessage: 'Siècle',
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
            defaultMessage: 'Rôle',
          })}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />

        {/* Section des faits marquants */}
        <div className="mb-4">
          <h4 className="mb-2">
            {intl.formatMessage({
              id: 'formulaire.titre.faits',
              defaultMessage: 'Faits marquants',
            })}
          </h4>

          {/* Liste dynamique des faits */}
          {faitsMarquants.map((fait, index) => (
            <div key={index} className="flex gap-2 mb-1">
              <input
                type="text"
                placeholder={intl.formatMessage(
                  {
                    id: 'formulaire.placeholder.fait',
                    defaultMessage: 'Fait {numero}',
                  },
                  { numero: index + 1 },
                )}
                value={fait}
                onChange={(e) => handleFaitChange(index, e.target.value)}
                className="flex-1 p-2 border rounded"
              />

              {/* Bouton supprimer un fait */}
              <button
                type="button"
                onClick={() => supprimerFait(index)}
                className="px-2 bg-red-500 text-white rounded"
              >
                {intl.formatMessage({
                  id: 'formulaire.bouton.supprimer',
                  defaultMessage: 'Supprimer',
                })}
              </button>
            </div>
          ))}

          {/* Bouton ajouter un fait */}
          <button
            type="button"
            onClick={ajouterFait}
            className="px-4 py-1 bg-gray-700 text-white rounded mt-1"
          >
            {intl.formatMessage({
              id: 'formulaire.bouton.ajouter.fait',
              defaultMessage: 'Ajouter un fait',
            })}
          </button>
        </div>

        {/* Bouton d’envoi */}
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-800"
        >
          {intl.formatMessage({
            id: 'formulaire.bouton.ajouter',
            defaultMessage: 'Ajouter',
          })}
        </button>

        {/* Affichage message d’erreur */}
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default FormulaireAjout;
