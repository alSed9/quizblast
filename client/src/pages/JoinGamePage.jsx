import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'

function JoinGamePage() {
  const navigate = useNavigate()
  const [code, setCode] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    inputRefs[0].current?.focus()
  }, [inputRefs])

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError('')

    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pastedData.length > 0) {
      const newCode = [...code]
      pastedData.split('').forEach((digit, index) => {
        if (index < 4) newCode[index] = digit
      })
      setCode(newCode)
      const focusIndex = Math.min(pastedData.length, 3)
      inputRefs[focusIndex].current?.focus()
    }
  }

  const handleJoin = () => {
    const roomCode = code.join('')
    if (roomCode.length !== 4) {
      setError('Veuillez entrer les 4 chiffres du code')
      return
    }
    navigate(`/join/${roomCode}/nickname`)
  }

  const isComplete = code.every(digit => digit !== '')

  const handleNumpadClick = (num) => {
    const emptyIndex = code.findIndex(digit => digit === '')
    if (emptyIndex !== -1) {
      handleInputChange(emptyIndex, num.toString())
    }
  }

  const handleNumpadDelete = () => {
    const lastFilledIndex = code.map((d, i) => d !== '' ? i : -1).filter(i => i !== -1).pop()
    if (lastFilledIndex !== undefined) {
      const newCode = [...code]
      newCode[lastFilledIndex] = ''
      setCode(newCode)
      inputRefs[lastFilledIndex].current?.focus()
    }
  }

  return (
    <div className="bg-background text-on-background min-h-screen font-body-lg flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-gutter-mobile md:px-gutter-desktop max-w-max-width-host mx-auto w-full">
        
        <div className="text-center mb-12">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors active:scale-95 duration-100"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-display-md text-display-md text-on-surface">
              Rejoindre une partie
            </h1>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Entrez le code à 4 chiffres affiché sur l'écran
          </p>
        </div>

        <div className="w-full max-w-md bg-surface border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm">
          
          <div className="flex justify-center gap-4 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`
                  w-16 h-20 md:w-20 md:h-24 rounded-xl text-center
                  font-display-md text-display-md
                  border-2 outline-none transition-all
                  ${digit 
                    ? 'border-primary bg-primary-container/20 text-primary' 
                    : 'border-outline-variant bg-surface text-on-surface focus:border-primary'
                  }
                `}
              />
            ))}
          </div>

          {error && (
            <p className="text-error font-body-md text-body-md text-center mb-4">
              {error}
            </p>
          )}

          <p className="font-body-md text-body-md text-on-surface-variant text-center mb-8">
            Le code à 4 chiffres affiché sur l'écran
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumpadClick(num)}
                className="bg-surface border border-outline-variant rounded-xl py-4 font-headline-md text-headline-md text-on-surface hover:bg-surface-container-low transition-colors active:scale-95 duration-100"
              >
                {num}
              </button>
            ))}
            <div></div>
            <button
              onClick={() => handleNumpadClick(0)}
              className="bg-surface border border-outline-variant rounded-xl py-4 font-headline-md text-headline-md text-on-surface hover:bg-surface-container-low transition-colors active:scale-95 duration-100"
            >
              0
            </button>
            <button
              onClick={handleNumpadDelete}
              className="bg-surface border border-outline-variant rounded-xl py-4 font-headline-md text-headline-md text-on-surface hover:bg-surface-container-low transition-colors active:scale-95 duration-100"
            >
              <span className="material-symbols-outlined">backspace</span>
            </button>
          </div>

          <button
            onClick={handleJoin}
            disabled={!isComplete}
            className={`
              w-full px-8 py-5 rounded-xl font-headline-md text-headline-md
              flex items-center justify-center gap-3
              transition-all active:scale-95 duration-100
              ${isComplete
                ? 'bg-primary text-on-primary shadow-sm hover:bg-primary-fixed-variant'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              }
            `}
          >
            <span className="material-symbols-outlined">login</span>
            Rejoindre
          </button>

        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 text-on-surface-variant font-body-md text-body-md hover:text-on-surface transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Retour
        </button>

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

export default JoinGamePage