'use client'

import { useState, useCallback } from 'react'
import MicButton     from '@/components/MicButton'
import ProcessingView from '@/components/ProcessingView'
import ContactPicker  from '@/components/ContactPicker'
import ConfirmScreen  from '@/components/ConfirmScreen'
import { parseTranscript } from '@/utils/parseTranscript'
import { searchContacts,  type Contact } from '@/utils/contacts'

// ─── App state machine ────────────────────────────────────────────────────────
type Phase =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'pick-contact'
  | 'confirm'

interface AppState {
  phase: Phase
  transcript: string
  contactName: string
  message: string
  matches: Contact[]
  selected: Contact | null
  error: string
}

const INIT: AppState = {
  phase: 'idle', transcript: '', contactName: '',
  message: '', matches: [], selected: null, error: ''
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [state, setState] = useState<AppState>(INIT)

  const update = (patch: Partial<AppState>) =>
    setState(prev => ({ ...prev, ...patch }))

  // Called by MicButton when STT returns a final transcript
  const onTranscript = useCallback(async (transcript: string) => {
    update({ phase: 'processing', transcript, error: '' })

    // Parse locally — no AI API needed
    const parsed = parseTranscript(transcript)
    if (!parsed) {
      update({ phase: 'idle', error: 'Try saying: "Tell John I\'ll be 15 minutes late"' })
      return
    }

    // Search contacts (web uses Web Contacts API if available, else demo contacts)
    const matches = await searchContacts(parsed.contact)

    if (matches.length === 0) {
      update({ phase: 'idle', error: `No contact found matching "${parsed.contact}"` })
      return
    }

    if (matches.length === 1) {
      update({ phase: 'confirm', contactName: parsed.contact, message: parsed.message, matches, selected: matches[0] })
      return
    }

    update({ phase: 'pick-contact', contactName: parsed.contact, message: parsed.message, matches })
  }, [])

  const onSelectContact = (contact: Contact) => {
    update({ phase: 'confirm', selected: contact })
  }

  const onSend = (finalMessage: string) => {
    if (!state.selected) return
    const phone = state.selected.phone.replace(/\D/g, '')
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(finalMessage)}`
    window.open(url, '_blank')
    setState(INIT)
  }

  const reset = () => setState(INIT)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">

      {/* Brand header */}
      <div className="mb-12 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5B4FCF] mb-4">
          <MicIcon size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Navis AI</h1>
        <p className="mt-1 text-sm text-white/50">Your voice. Delivered.</p>
      </div>

      {/* State views */}
      {state.phase === 'idle' && (
        <IdleView onTranscript={onTranscript} error={state.error} />
      )}

      {state.phase === 'listening' && (
        <ListeningView onCancel={reset} />
      )}

      {state.phase === 'processing' && (
        <ProcessingView transcript={state.transcript} />
      )}

      {state.phase === 'pick-contact' && (
        <ContactPicker
          contacts={state.matches}
          query={state.contactName}
          onSelect={onSelectContact}
          onBack={reset}
        />
      )}

      {state.phase === 'confirm' && state.selected && (
        <ConfirmScreen
          contact={state.selected}
          message={state.message}
          onSend={onSend}
          onBack={reset}
        />
      )}
    </main>
  )
}

// ─── Idle view ────────────────────────────────────────────────────────────────
function IdleView({ onTranscript, error }: {
  onTranscript: (t: string) => void
  error: string
}) {
  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <MicButton onTranscript={onTranscript} />

      <p className="text-white/40 text-sm">Tap the mic and speak naturally</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-red-300 text-sm max-w-xs text-center">
          {error}
        </div>
      )}

      {/* Example commands */}
      <div className="mt-4 w-full max-w-sm rounded-2xl border border-white/8 bg-white/4 p-5">
        <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-3">Try saying</p>
        {[
          'Tell John I\'ll be 15 minutes late',
          'Message Sarah are you free tonight',
          'Remind David to send the report',
        ].map((ex) => (
          <p key={ex} className="text-sm text-white/60 py-1.5 border-b border-white/6 last:border-0">
            &ldquo;{ex}&rdquo;
          </p>
        ))}
      </div>
    </div>
  )
}

// ─── Listening view ───────────────────────────────────────────────────────────
function ListeningView({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 rounded-full bg-[#11C4B0]/20 animate-pulse-ring" />
        <div className="absolute w-24 h-24 rounded-full bg-[#11C4B0]/15 animate-pulse-ring" style={{ animationDelay: '0.3s' }} />
        <div className="w-20 h-20 rounded-full bg-[#11C4B0] flex items-center justify-center">
          <MicIcon size={36} />
        </div>
      </div>
      <p className="text-white/70 text-sm">Listening…</p>
      <button onClick={onCancel} className="text-xs text-white/30 hover:text-white/60 transition-colors mt-2">
        Cancel
      </button>
    </div>
  )
}

// ─── Mic icon ─────────────────────────────────────────────────────────────────
function MicIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="9"  y1="22" x2="15" y2="22" />
    </svg>
  )
}
