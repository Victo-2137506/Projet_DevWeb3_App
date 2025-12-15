//Le tailwindCSS est généré par ChatGPT

import { useIntl } from 'react-intl'; // inspire de https://formatjs.github.io/docs/getting-started/message-declaration et explication de Claude.ia

function Accueil() {
  const intl = useIntl();

  return (
    <div className="min-h-screen bg-[#f7f2e7] text-[#3b2f2f] flex flex-col items-center justify-center p-10 font-serif">
      <h1 className="text-5xl font-bold mb-6 tracking-widest text-center text-[#2c221c] drop-shadow-md">
        {intl.formatMessage({
          id: 'accueil.titre',
          defaultMessage: 'Chroniques du passé',
        })}
      </h1>

      <p className="text-xl max-w-2xl text-center mb-10 text-[#4a3d35]">
        {intl.formatMessage({
          id: 'accueil.description',
          defaultMessage:
            "Plongez dans les personnages qui ont façonné l'histoire. Explorez un univers inspiré des vieux parchemins et des chroniques anciennes.",
        })}
      </p>

      <div className="mt-14 text-center text-sm italic text-[#6e5a50]">
        {intl.formatMessage({
          id: 'accueil.citation',
          defaultMessage:
            "Ceux qui ne connaissent pas l'histoire sont condamnés à la revivre. - George Santayana",
        })}
      </div>
    </div>
  );
}

export default Accueil;
