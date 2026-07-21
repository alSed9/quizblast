import { useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-gutter-mobile md:px-gutter-desktop max-w-max-width-host mx-auto w-full">
        
        <div className="text-center mb-16">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
            QuizBlast
          </h1>
          <p className="font-headline-md text-headline-md text-on-surface-variant">
            Le quiz multijoueur pour vos soirées
          </p>
        </div>

        <div className="w-full max-w-lg flex flex-col gap-8">
          
          <button
            onClick={() => navigate('/create')}
            className="bg-primary text-on-primary px-8 py-8 rounded-xl font-headline-md text-headline-md flex flex-col items-center gap-3 shadow-sm hover:bg-primary-fixed-variant transition-all active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined text-4xl">cast</span>
            <span>Créer une partie</span>
            <span className="font-body-md text-body-md text-on-primary/80">
              Je suis l'hôte, je lance le quiz sur la TV
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant"></div>
            <span className="font-label-lg text-label-lg text-on-surface-variant uppercase">ou</span>
            <div className="flex-1 h-px bg-outline-variant"></div>
          </div>

          <button
            onClick={() => navigate('/join')}
            className="bg-surface border border-outline-variant text-on-surface px-8 py-8 rounded-xl font-headline-md text-headline-md flex flex-col items-center gap-3 shadow-sm hover:bg-surface-container-low transition-all active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined text-4xl text-secondary">smartphone</span>
            <span>Rejoindre une partie</span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              Je joue depuis mon téléphone
            </span>
          </button>

        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary">devices</span>
            <span className="font-body-md text-body-md">Pas besoin d'application</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary">group</span>
            <span className="font-body-md text-body-md">Jusqu'à 20 joueurs</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary">all_inclusive</span>
            <span className="font-body-md text-body-md">100% gratuit</span>
          </div>
        </div>

      </main>

      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant p-4 md:p-gutter-desktop mt-auto">
        <div className="max-w-max-width-host mx-auto text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            QuizBlast — Le quiz qui enflamme vos soirées 🎉
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage