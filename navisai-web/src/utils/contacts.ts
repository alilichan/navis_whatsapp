export interface Contact {
  id: string
  name: string
  phone: string
}

// Demo contacts shown when the Web Contacts API is unavailable
// (most browsers/desktop don't support it — only Chrome on Android)
const DEMO_CONTACTS: Contact[] = [
  { id: '1', name: 'John Tan',    phone: '+65 8854 7138' },
  { id: '2', name: 'John Lee',    phone: '+65 8854 7138' },
  { id: '3', name: 'Sarah Wong',  phone: '+65 8854 7138' },
  { id: '4', name: 'David Lim',   phone: '+65 8854 7138' },
  { id: '5', name: 'Mum',         phone: '+65 8854 7138' },
  { id: '6', name: 'Alice Ng',    phone: '+65 8854 7138' },
  { id: '7', name: 'Bob Chen',    phone: '+65 8854 7138' },
]

/**
 * Searches contacts by name.
 *
 * On Chrome for Android, tries the Web Contact Picker API first.
 * Falls back to demo contacts on all other platforms (desktop, Safari, Firefox).
 *
 * In a production app, you'd connect to a backend that stores contacts
 * synced from the user's phone or Google Contacts API.
 */
export async function searchContacts(query: string): Promise<Contact[]> {
  const lower = query.toLowerCase().trim()

  // Try Web Contact Picker API (Chrome Android only)
  if ('contacts' in navigator && 'ContactsManager' in window) {
    try {
      const results = await (navigator as any).contacts.select(
        ['name', 'tel'],
        { multiple: true }
      )
      return results
        .filter((c: any) => c.name?.[0]?.toLowerCase().includes(lower))
        .map((c: any, i: number) => ({
          id: String(i),
          name: c.name?.[0] ?? 'Unknown',
          phone: c.tel?.[0] ?? '',
        }))
    } catch {
      // User dismissed or API unavailable — fall through to demo
    }
  }

  // Demo fallback — fuzzy match on name
  return DEMO_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(lower)
  )
}
