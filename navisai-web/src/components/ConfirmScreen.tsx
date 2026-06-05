'use client'

import { useState } from 'react'
import type { Contact } from '@/utils/contacts'

interface Props {
  contact: Contact
  message: string
  onSend: (message: string) => void
  onBack: () => void
}

function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function ConfirmScreen({ contact, message, onSend, onBack }: Props) {
  const [editedMessage, setEditedMessage] = useState(message)
  const [editing, setEditing] = useState(false)

  return (
    <div className="w-full max-w-sm animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>

      {/* To: card */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5 mb-3">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-3">To</p>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#5B4FCF] flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
            {getInitials(contact.name)}
          </div>
          <div>
            <p className="text-white font-medium">{contact.name}</p>
            <p className="text-white/40 text-sm">{contact.phone}</p>
          </div>
        </div>
      </div>

      {/* Message card */}
      <div className="rounded-2xl border border-white/8 bg-white/4 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white/30 uppercase tracking-widest">Message</p>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-[#11C4B0] hover:text-[#0ea898] transition-colors flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <textarea
            value={editedMessage}
            onChange={e => setEditedMessage(e.target.value)}
            className="w-full bg-white/6 rounded-xl p-3 text-white text-sm resize-none outline-none border border-white/10 focus:border-[#5B4FCF] transition-colors"
            rows={4}
            autoFocus
          />
        ) : (
          <p className="text-white/80 text-sm leading-relaxed">{editedMessage}</p>
        )}

        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="mt-2 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Done editing
          </button>
        )}
      </div>

      {/* Action buttons */}
      <button
        onClick={() => onSend(editedMessage)}
        className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc59] active:scale-98 transition-all rounded-2xl py-4 text-white font-semibold text-sm mb-3"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Open in WhatsApp
      </button>

      <button
        onClick={onBack}
        className="w-full text-center text-sm text-white/30 hover:text-white/50 transition-colors py-2"
      >
        Cancel
      </button>
    </div>
  )
}
