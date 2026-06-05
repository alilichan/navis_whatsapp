'use client'

import { useState, useRef } from 'react'

interface Props {
  onTranscript: (text: string) => void
}

export default function MicButton({ onTranscript }: Props) {
  const [listening, setListening] = useState(false)
  const [error, setError]         = useState('')
  const recogRef = useRef<any>(null)

  const start = () => {
    const win = window as any
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition
    if (!SR) {
      setError("Your browser doesn't support voice input. Try Chrome or Edge.")
      return
    }

    const recog = new SR()
    recog.lang            = 'en-US'
    recog.interimResults  = false
    recog.maxAlternatives = 1

    recog.onstart  = () => { setListening(true); setError('') }
    recog.onend    = () => setListening(false)
    recog.onerror  = (e: any) => { setListening(false); setError(`Mic error: ${e.error}`) }
    recog.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      onTranscript(transcript)
    }

    recog.start()
    recogRef.current = recog
  }

  const stop = () => {
    recogRef.current?.stop()
    setListening(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={listening ? stop : start}
        className="relative flex items-center justify-center w-24 h-24 rounded-full transition-transform active:scale-95 focus:outline-none"
        aria-label={listening ? 'Stop listening' : 'Start voice command'}
      >
        {listening && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#11C4B0]/30 animate-pulse-ring" />
            <span className="absolute inset-0 rounded-full bg-[#11C4B0]/15 animate-pulse-ring" style={{ animationDelay: '0.4s' }} />
          </>
        )}
        <span className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          listening ? 'bg-[#11C4B0]' : 'bg-[#5B4FCF] hover:bg-[#4a3fb8]'
        }`}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {listening ? (
              <rect x="6" y="6" width="12" height="12" rx="2" fill="white" stroke="none" />
            ) : (
              <>
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="9"  y1="22" x2="15" y2="22" />
              </>
            )}
          </svg>
        </span>
      </button>

      {error && (
        <p className="text-red-400 text-xs text-center max-w-xs">{error}</p>
      )}
    </div>
  )
}
