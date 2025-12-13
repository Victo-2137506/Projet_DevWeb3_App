import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../contexts/LoginContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useIntl } from 'react-intl';

// Le tailwindCSS est produit par ChatGPT

// Interface qui représente un personnage historique
// Contrairement au fichier Histoire.tsx, celle-ci affiche toutes les variables de la personne historique
interface IHistoire {
  _id: string;
  nom: string;
  pays: string;
  naissance: string;
  mort?: string | null;
  vivant: boolean;
  siecle: number;
  role: string;
  faitsMarquants: string[];
}

function HistoireDetail() {
  // Récupération de l'id
  const { id } = useParams();
  // Récupère le token depuis le LoginContext
  const { token } = useContext(LoginContext);
  // Hook pour la navigation
  const navigate = useNavigate();
  // Hook pour l'intertionalisation
  const intl = useIntl();

  // Stock le personnage historique depuis l'API
  const [personnage, setPersonnage] = useState<IHistoire | null>(null);

  // Chargement des données du personnage historique
  useEffect(() => {
    // On ne fait rien si il y a pas de id ou de token
    if (!id || !token) return;
    axios
      .get(
        // Appel l'API pour récupérer un personnage historique par son id
        `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setPersonnage(res.data.histoire))
      .catch((err) => console.error(err));
  }, [id, token]);

  const handleDelete = async () => {
    if (!token || !id) return;

    // Confirmation avant suppression
    const confirmDelete = window.confirm(
      intl.formatMessage({
        id: 'histoire.confirmer.suppression',
        defaultMessage: 'Voulez-vous vraiment supprimer ce personnage ?',
      }),
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        // Appel l'api pour supprimer le personnage
        `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/supprimer/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(
        intl.formatMessage({
          id: 'histoire.suppression.succes',
          defaultMessage: 'Personnage supprimé avec succès.',
        }),
      );
      // Retourne à la page Histoire
      navigate('/histoire');
    } catch (error) {
      console.error('Erreur lors de la suppression', error);
      alert(
        intl.formatMessage({
          id: 'histoire.erreur.suppression',
          defaultMessage: 'Impossible de supprimer ce personnage.',
        }),
      );
    }
  };

  if (!personnage)
    return (
      <p>
        {intl.formatMessage({
          id: 'histoire.chargement',
          defaultMessage: 'Chargement des personnages...',
        })}
      </p>
    );

  return (
    <div className="min-h-screen bg-[#f7f2e7] text-[#3b2f2f] flex flex-col items-center p-10 font-serif">
      {/* Nom du personnage */}
      <h1 className="text-4xl font-bold mb-6">{personnage.nom}</h1>

      {/* Carte contenant les informations */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
        <p>
          <strong>
            {intl.formatMessage({
              id: 'histoire.label.pays',
              defaultMessage: 'Pays',
            })}
            :
          </strong>
          {personnage.pays}
        </p>

        <p>
          <strong>
            {intl.formatMessage({
              id: 'histoire.label.naissance',
              defaultMessage: 'Naissance',
            })}
            :
          </strong>
          {new Date(personnage.naissance).toLocaleDateString()}
        </p>

        {/* Affiché uniquement si la date de mort existe */}
        {personnage.mort && (
          <p>
            <strong>
              {intl.formatMessage({
                id: 'histoire.label.mort',
                defaultMessage: 'Mort',
              })}
              :
            </strong>
            {new Date(personnage.mort).toLocaleDateString()}
          </p>
        )}

        <p>
          <strong>
            {intl.formatMessage({
              id: 'histoire.label.vivant',
              defaultMessage: 'Vivant',
            })}
            :
          </strong>{' '}
          {personnage.vivant
            ? intl.formatMessage({
                id: 'histoire.vivant.oui',
                defaultMessage: 'Oui',
              })
            : intl.formatMessage({
                id: 'histoire.vivant.non',
                defaultMessage: 'Non',
              })}
        </p>

        <p>
          <strong>
            {intl.formatMessage({
              id: 'histoire.label.siecle',
              defaultMessage: 'Siècle',
            })}
            :
          </strong>
          {personnage.siecle}
        </p>

        <p>
          <strong>
            {intl.formatMessage({
              id: 'histoire.label.role',
              defaultMessage: 'Rôle',
            })}
            :
          </strong>
          {personnage.role}
        </p>

        {/* Liste des faits marquants */}
        {personnage.faitsMarquants.length > 0 && (
          <ul className="list-disc list-inside mt-2">
            {personnage.faitsMarquants.map((fait, i) => (
              <li key={i}>{fait}</li>
            ))}
          </ul>
        )}

        {/* Boutons d’actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(`/histoire/modifier/${personnage._id}`)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <FaEdit /> Modifier
          </button>

          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 flex items-center gap-2"
          >
            <FaTrash /> Supprimer
          </button>

          <button
            onClick={() => navigate('/histoire')}
            className="text-gray-600 hover:text-gray-800"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoireDetail;
