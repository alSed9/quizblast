import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="w-full h-16 bg-surface shadow-sm border-b border-outline-variant flex justify-between items-center px-4 md:px-gutter-desktop max-w-max-width-host mx-auto shrink-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4">
        <span className="font-display-md text-display-md font-extrabold text-primary">
          QuizBlast
        </span>
      </Link>

      {/* Navigation desktop */}
      <nav className="hidden md:flex gap-6 items-end h-full">
        <div className="h-full flex items-end">
          <span className="text-on-surface-variant font-medium pb-2 hover:bg-surface-container-high transition-colors px-4 rounded-t-lg cursor-pointer">
            Comment jouer ?
          </span>
        </div>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors active:scale-95 duration-100">
          <span className="material-symbols-outlined">help</span>
        </button>
      </div>
    </header>
  )
}

export default Header