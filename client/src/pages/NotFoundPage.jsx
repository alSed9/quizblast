import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col items-center justify-center px-gutter-mobile">
      
      <div className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl p-10 shadow-sm text-center">
        
        {/* Icône */}
        <span className="material-symbols-outlined text-7xl text-on-surface-variant mb-6 block">
          search_off
        </span>

        {/* Titre */}
        <h1 className="font-display-md text-display-md text-on-surface mb-4">
          Partie introuvable
        </h1>

        {/* Message */}
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          Le code de partie est invalide ou la partie n'existe plus.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-on-primary px-8 py-5 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-3 shadow-sm hover:bg-primary-fixed-variant transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">home</span>
            Retour à l'accueil
          </button>
          
          <button
            onClick={() => navigate('/join')}
            className="w-full bg-surface border border-outline-variant text-on-surface px-8 py-5 rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-3 shadow-sm hover:bg-surface-container-low transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">login</span>
            Rejoindre une partie
          </button>
        </div>

      </div>

      <p className="font-body-md text-body-md text-on-surface-variant mt-8">
        QuizBlast — Le quiz qui enflamme vos soirées 🎉
      </p>

    </div>
  )
}

export default NotFoundPage