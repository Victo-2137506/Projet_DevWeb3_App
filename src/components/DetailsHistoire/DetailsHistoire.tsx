import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LoginContext } from '../contexts/LoginContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useIntl } from 'react-intl';

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
  const { id } = useParams();
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();
  const intl = useIntl();

  const [personnage, setPersonnage] = useState<IHistoire | null>(null);

  useEffect(() => {
    if (!id || !token) return;
    axios
      .get(
        `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((res) => setPersonnage(res.data.histoire))
      .catch((err) => console.error(err));
  }, [id, token]);

  const handleDelete = async () => {
    if (!token || !id) return;

    const confirmDelete = window.confirm(
      intl.formatMessage({
        id: 'histoire.confirmer.suppression',
        defaultMessage: 'Voulez-vous vraiment supprimer ce personnage ?',
      }),
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/supprimer/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(
        intl.formatMessage({
          id: 'histoire.suppression.succes',
          defaultMessage: 'Personnage supprimé avec succès.',
        }),
      );
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
      <h1 className="text-4xl font-bold mb-6">{personnage.nom}</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
        <p>
          <strong>
            {intl.formatMessage({
              id: 'histoire.label.pays',
              defaultMessage: 'Pays',
            })}
            :
          </strong>{' '}
          {personnage.pays}
        </p>
        <p>
          <strong>
            {intl.formatMessage({
              id: 'histoire.label.naissance',
              defaultMessage: 'Naissance',
            })}
            :
          </strong>{' '}
          {new Date(personnage.naissance).toLocaleDateString()}
        </p>
        {personnage.mort && (
          <p>
            <strong>
              {intl.formatMessage({
                id: 'histoire.label.mort',
                defaultMessage: 'Mort',
              })}
              :
            </strong>{' '}
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
          </strong>{' '}
          {personnage.siecle}
        </p>
        <p>
          <strong>
            {intl.formatMessage({
              id: 'histoire.label.role',
              defaultMessage: 'Rôle',
            })}
            :
          </strong>{' '}
          {personnage.role}
        </p>

        {personnage.faitsMarquants.length > 0 && (
          <ul className="list-disc list-inside mt-2">
            {personnage.faitsMarquants.map((fait, i) => (
              <li key={i}>{fait}</li>
            ))}
          </ul>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate(`/histoire/modifier/${personnage._id}`)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            title={intl.formatMessage({
              id: 'histoire.bouton.modifier',
              defaultMessage: 'Modifier',
            })}
          >
            <FaEdit />{' '}
            {intl.formatMessage({
              id: 'histoire.bouton.modifier',
              defaultMessage: 'Modifier',
            })}
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 flex items-center gap-2"
            title={intl.formatMessage({
              id: 'histoire.bouton.supprimer',
              defaultMessage: 'Supprimer',
            })}
          >
            <FaTrash />{' '}
            {intl.formatMessage({
              id: 'histoire.bouton.supprimer',
              defaultMessage: 'Supprimer',
            })}
          </button>
          <button
            onClick={() => navigate('/histoire')}
            className="text-gray-600 hover:text-gray-800"
            title={intl.formatMessage({
              id: 'histoire.bouton.retour',
              defaultMessage: 'Retour',
            })}
          >
            {intl.formatMessage({
              id: 'histoire.bouton.retour',
              defaultMessage: 'Retour',
            })}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoireDetail;
