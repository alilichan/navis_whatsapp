'use client'

import type { Contact } from '@/utils/contacts'

interface Props {
  contacts: Contact[]
  query: string
  onSelect: (c: Contact) => void
  onBack: () => void
}

export default function ContactPicker({ contacts, query, onSelect, onBack }: Props) {
  return (
    <div className="w-full max-w-sm animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-6 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>

      <p className="text-white/50 text-sm mb-3">
        Found {contacts.length} contacts matching &ldquo;{query}&rdquo;
      </p>

      <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
        {contacts.map((contact, i) => (
          <button
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-white/6 transition-colors text-left ${
              i < contacts.length - 1 ? 'border-b border-white/6' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#5B4FCF] flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
              {getInitials(contact.name)}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{contact.name}</p>
              <p className="text-white/40 text-xs">{contact.phone}</p>
            </div>
            <svg className="ml-auto text-white/20" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
