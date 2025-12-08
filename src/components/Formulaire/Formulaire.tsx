import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { LoginContext } from '../contexts/LoginContext';

function FormulaireAjout() {
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();
  const intl = useIntl();

  const [nom, setNom] = useState('');
  const [pays, setPays] = useState('');
  const [naissance, setNaissance] = useState('');
  const [mort, setMort] = useState('');
  const [vivant, setVivante] = useState(false);
  const [siecle, setSiecle] = useState<number | ''>('');
  const [role, setRole] = useState('');
  const [faitsMarquants, setFaitsMarquants] = useState<string[]>(['']);
  const [message, setMessage] = useState('');

  const handleFaitChange = (index: number, value: string) => {
    const nouveauxFaits = [...faitsMarquants];
    nouveauxFaits[index] = value;
    setFaitsMarquants(nouveauxFaits);
  };

  const ajouterFait = () => setFaitsMarquants([...faitsMarquants, '']);
  const supprimerFait = (index: number) =>
    setFaitsMarquants(faitsMarquants.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      if (response.ok) {
        navigate('/histoire');
      } else {
        setMessage(
          intl.formatMessage({
            id: 'formulaire.erreur.ajout',
            defaultMessage: "Erreur lors de l'ajout de l'histoire.",
          }),
        );
      }
    } catch (error) {
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
      <h1 className="text-4xl font-bold mb-6">
        {intl.formatMessage({
          id: 'formulaire.titre.ajout',
          defaultMessage: 'Ajouter une personne historique',
        })}
      </h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        {/* Champs identiques au formulaire de modification */}
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
        <input
          type="date"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.naissance',
            defaultMessage: 'Naissance',
          })}
          value={naissance}
          onChange={(e) => setNaissance(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="date"
          placeholder={intl.formatMessage({
            id: 'formulaire.placeholder.mort',
            defaultMessage: 'Mort',
          })}
          value={mort}
          onChange={(e) => setMort(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={vivant}
            onChange={(e) => setVivante(e.target.checked)}
            className="mr-2"
          />
          {intl.formatMessage({
            id: 'formulaire.label.vivant',
            defaultMessage: 'Vivant ?',
          })}
        </label>
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
        <div className="mb-4">
          <h4 className="mb-2">
            {intl.formatMessage({
              id: 'formulaire.titre.faits',
              defaultMessage: 'Faits marquants',
            })}
          </h4>
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
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-800"
        >
          {intl.formatMessage({
            id: 'formulaire.bouton.ajouter',
            defaultMessage: 'Ajouter',
          })}
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default FormulaireAjout;
