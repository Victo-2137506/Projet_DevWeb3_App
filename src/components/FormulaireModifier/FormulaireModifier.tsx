import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContext';

function FormulaireModifier() {
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();
  const { id } = useParams(); // récupère l'id depuis l'URL

  const [nom, setNom] = useState('');
  const [pays, setPays] = useState('');
  const [naissance, setNaissance] = useState('');
  const [mort, setMort] = useState('');
  const [vivant, setVivante] = useState(false);
  const [siecle, setSiecle] = useState<number | ''>('');
  const [role, setRole] = useState('');
  const [faitsMarquants, setFaitsMarquants] = useState<string[]>(['']);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/histoire/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (response.ok) {
          const data = await response.json();
          const h = data.histoire;
          setNom(h.nom);
          setPays(h.pays);
          setNaissance(h.naissance);
          setMort(h.mort || '');
          setVivante(h.vivant);
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

  const ajouterFait = () => setFaitsMarquants([...faitsMarquants, '']);
  const supprimerFait = (index: number) =>
    setFaitsMarquants(faitsMarquants.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMessage(
        'Vous devez être connecté pour modifier une personne historique.',
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
        setMessage("Erreur lors de la modification de l'histoire.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur réseau, impossible de modifier l'histoire.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2e7] text-[#3b2f2f] flex flex-col items-center justify-start p-10 font-serif">
      <h1 className="text-4xl font-bold mb-6">
        Modifier une personne historique
      </h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Pays"
          value={pays}
          onChange={(e) => setPays(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="date"
          placeholder="Naissance"
          value={naissance.slice(0, 10)}
          onChange={(e) => setNaissance(e.target.value)}
          required
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="date"
          placeholder="Mort"
          value={mort.slice(0, 10)}
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
          Vivant ?
        </label>
        <input
          type="number"
          placeholder="Siècle"
          value={siecle}
          onChange={(e) =>
            setSiecle(e.target.value ? Number(e.target.value) : '')
          }
          required
          className="mb-2 p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Rôle"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        />
        <div className="mb-4">
          <h4 className="mb-2">Faits marquants</h4>
          {faitsMarquants.map((fait, index) => (
            <div key={index} className="flex gap-2 mb-1">
              <input
                type="text"
                placeholder={`Fait ${index + 1}`}
                value={fait}
                onChange={(e) => handleFaitChange(index, e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => supprimerFait(index)}
                className="px-2 bg-red-500 text-white rounded"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={ajouterFait}
            className="px-4 py-1 bg-gray-700 text-white rounded mt-1"
          >
            Ajouter un fait
          </button>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
        >
          Modifier
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default FormulaireModifier;
